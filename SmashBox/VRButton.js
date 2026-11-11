/**
 * VRButton.js
 *
 * A small "Enter VR" button for three.js WebXR applications.
 *
 * This implementation deliberately does NOT create an XRWebGLLayer itself.
 * three.js owns the session's base layer and installs it inside
 * WebXRManager.setSession().  The previous button version created a second
 * XRWebGLLayer and called updateRenderState() before handing the session to
 * three.js.  That double-layer sequence can fail on newer headsets (the
 * second layer may be rejected, or the second render-state update may be
 * ignored), and because the old code had no error handler the failure was
 * silent: the page stayed outside immersive VR.
 *
 * The button therefore only:
 *   1. Ensures the renderer's WebGL context is XR-compatible.
 *   2. Chooses a reference space that the session actually granted.
 *   3. Calls renderer.xr.setSession(session) and lets three.js do the rest.
 *
 * Usage (unchanged from before):
 *   import { VRButton } from './VRButton.js';
 *   document.body.appendChild(VRButton.createButton(renderer, {
 *       referenceSpaceType: 'local-floor'
 *   }));
 */

// Features we would like when they are available.  They are optional so that
// requestSession() still succeeds on devices that do not expose them.
const DEFAULT_OPTIONAL_FEATURES = [ 'local-floor', 'bounded-floor' ];

/**
 * Log an error with a consistent prefix so failures are easy to find in the
 * headset/browser remote-debugging console.
 */
function logError( message, error ) {

	console.error( '[VRButton] ' + message, error );

}

/**
 * Build the XRSessionInit object, merging caller-supplied options with the
 * default optional features (without creating duplicates).
 */
function buildSessionInit( options ) {

	const init = Object.assign(
		{},
		options && options.sessionInit ? options.sessionInit : {}
	);

	const supplied = Array.isArray( init.optionalFeatures ) ? init.optionalFeatures : [];
	const merged = DEFAULT_OPTIONAL_FEATURES.concat( supplied );

	init.optionalFeatures = merged.filter( function ( feature, index ) {

		return merged.indexOf( feature ) === index;

	} );

	return init;

}

/**
 * Make sure the WebGL context can be used by an immersive XRSession.
 *
 * Modern browsers support creating the context with { xrCompatible: true }.
 * This project does that in index_xr.js, so normally this is a no-op.  The
 * async makeXRCompatible() fallback is kept for callers that pass a renderer
 * created the old way.
 */
async function ensureXRCompatible( renderer ) {

	const context = renderer.getContext ? renderer.getContext() : null;

	if ( ! context ) {

		throw new Error( 'The renderer has no WebGL context.' );

	}

	const attributes = context.getContextAttributes ? context.getContextAttributes() : null;

	if ( attributes && attributes.xrCompatible === true ) {

		return;

	}

	if ( typeof context.makeXRCompatible === 'function' ) {

		await context.makeXRCompatible();

	}

}

/**
 * Pick the best reference space that the session actually enabled.
 *
 * "local" is always available for immersive sessions.  Floor spaces must be
 * requested as features and can be denied by the runtime.  If we blindly ask
 * three.js for "local-floor" when it was not granted, its
 * requestReferenceSpace() promise rejects and the app never starts presenting.
 */
function chooseReferenceSpaceType( session, preferredType ) {

	const enabled = session ? session.enabledFeatures : null;

	if ( enabled && typeof enabled.includes === 'function' ) {

		if ( preferredType && enabled.includes( preferredType ) ) {

			return preferredType;

		}

		if ( enabled.includes( 'local-floor' ) ) {

			return 'local-floor';

		}

		if ( enabled.includes( 'bounded-floor' ) ) {

			return 'bounded-floor';

		}

		// Immersive sessions always include "local".
		return 'local';

	}

	// Older browsers do not expose enabledFeatures; keep the historical
	// three.js default so behavior there is unchanged.
	return preferredType || 'local-floor';

}

/**
 * Apply a consistent, high-contrast style to the button so it is usable both
 * on a desktop browser and inside a headset's 2D browser view.
 */
function stylizeButton( element ) {

	element.style.position = 'fixed';
	element.style.left = '50%';
	element.style.bottom = '24px';
	element.style.transform = 'translateX(-50%)';
	element.style.padding = '12px 24px';
	element.style.border = '2px solid #ffffff';
	element.style.borderRadius = '6px';
	element.style.background = 'rgba(0, 0, 0, 0.6)';
	element.style.color = '#ffffff';
	element.style.font = 'bold 16px sans-serif';
	element.style.textAlign = 'center';
	element.style.cursor = 'pointer';
	element.style.zIndex = '9999';

}

/**
 * Create a non-interactive status element used when WebXR is unavailable.
 * Always returning an element is important because index_xr.js calls
 * document.body.appendChild(VRButton.createButton(renderer)).
 */
function createStatusMessage( text ) {

	const message = document.createElement( 'div' );
	message.textContent = text;
	stylizeButton( message );
	message.style.cursor = 'default';

	return message;

}

var VRButton = {

	/**
	 * Create and return the Enter VR button element.
	 *
	 * @param {THREE.WebGLRenderer} renderer  Renderer whose .xr manager will
	 *                                        own the immersive session.
	 * @param {Object} [options]
	 * @param {string} [options.referenceSpaceType='local-floor']  Preferred
	 *                                        reference space.
	 * @param {Object} [options.sessionInit]  Extra XRSessionInit fields.
	 * @returns {HTMLElement}
	 */
	createButton: function ( renderer, options ) {

		options = options || {};

		const preferredReferenceSpace = options.referenceSpaceType || 'local-floor';
		const sessionInit = buildSessionInit( options );

		if ( ! navigator.xr || typeof navigator.xr.isSessionSupported !== 'function' ) {

			if ( window.isSecureContext === false ) {

				logError( 'WebXR needs a secure context (HTTPS or localhost).', null );
				return createStatusMessage( 'WebXR Needs HTTPS' );

			}

			logError( 'WebXR is not available in this browser.', null );
			return createStatusMessage( 'WebXR Not Available' );

		}

		const button = document.createElement( 'button' );
		button.type = 'button';
		button.id = 'VRButton';
		button.textContent = 'Checking VR Support...';
		button.disabled = true;
		stylizeButton( button );

		let currentSession = null;
		let starting = false;

		function setButtonState( text, disabled ) {

			button.textContent = text;
			button.disabled = disabled === true;

		}

		function onSessionEnded() {

			if ( currentSession !== null ) {

				currentSession.removeEventListener( 'end', onSessionEnded );
				currentSession = null;

			}

			starting = false;
			setButtonState( 'Enter VR', false );

		}

		async function startSession() {

			starting = true;
			setButtonState( 'Entering VR...', true );

			let session = null;

			try {

				// requestSession() must be called directly from the click handler
				// so that it is covered by the user-activation gesture.
				session = await navigator.xr.requestSession( 'immersive-vr', sessionInit );

				currentSession = session;
				session.addEventListener( 'end', onSessionEnded );

				// The context is normally already XR-compatible because
				// index_xr.js creates it that way.  This also prevents the old
				// three.js makeXRCompatible() race for other callers.
				await ensureXRCompatible( renderer );

				const referenceSpaceType = chooseReferenceSpaceType(
					session,
					preferredReferenceSpace
				);

				renderer.xr.setReferenceSpaceType( referenceSpaceType );

				// three.js creates and installs the single XRWebGLLayer here.
				// Newer three.js returns a promise; r118 returns undefined.
				const result = renderer.xr.setSession( session );

				if ( result && typeof result.then === 'function' ) {

					await result;

				}

				setButtonState( 'Exit VR', false );

			} catch ( error ) {

				logError( 'Unable to start an immersive VR session.', error );

				// Do not leave a half-started session running.
				if ( session !== null ) {

					try {

						await session.end();

					} catch ( endError ) {

						logError( 'Unable to end the failed VR session.', endError );

					}

				}

				currentSession = null;
				starting = false;
				button.title = error && error.message ? error.message : String( error );
				setButtonState( 'Enter VR', false );

			}

		}

		button.addEventListener( 'click', function () {

			if ( starting ) {

				return;

			}

			if ( currentSession === null ) {

				startSession();

			} else {

				currentSession.end().catch( function ( error ) {

					logError( 'Unable to end the VR session.', error );

				} );

			}

		} );

		navigator.xr.isSessionSupported( 'immersive-vr' )
			.then( function ( supported ) {

				if ( supported ) {

					setButtonState( 'Enter VR', false );

				} else {

					logError( 'This device does not support immersive-vr sessions.', null );
					button.textContent = 'VR Not Supported';
					button.disabled = true;

				}

			} )
			.catch( function ( error ) {

				logError( 'isSessionSupported( "immersive-vr" ) failed.', error );
				button.textContent = 'VR Not Supported';
				button.disabled = true;

			} );

		return button;

	}

};

export { VRButton };
