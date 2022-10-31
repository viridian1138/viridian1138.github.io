


//$$strtCprt
/**
* Smash Box 
* 
* Copyright (C) 2022 Thornton Green
* 
* This program is free software; you can redistribute it and/or modify it under the terms of the GNU General Public License as
* published by the Free Software Foundation; either version 3 of the License, or (at your option) any later version.
* This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty 
* of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
* You should have received a copy of the GNU General Public License along with this program; if not, 
* see <http://www.gnu.org/licenses>.
* Additional permission under GNU GPL version 3 section 7
*
*/
//$$endCprt




import * as THREE from './modules/three.module.js';
import { VRButton } from './VRButton.js';



// A strategy.
// NOTE: this is intended to be essentially an abstract class.
class Strategy {

    // Initializes an instance of the strategy.
	init(tmpObj, strtTime) {
	
	} // init



    // Rotates a position near the player camera based on the input rand value.
	randRotateClose(tmpObj, rand, locn) {
		if (rand > 0.6666) {
			return;
		}

		var bucketCosine = tmpObj.bucketCosine;

		var bucketSine = tmpObj.bucketSine;

		if (rand < 0.33333) {
			bucketSine = - bucketSine;
		}

		const xx = locn.x;

		const yy = locn.z;

		const xx2 = xx * bucketCosine - yy * bucketSine;

		const yy2 = xx * bucketSine + yy * bucketCosine;

		locn.x = xx2;

		locn.z = yy2;

	} // randRotateClose




    // Rotates a far position near the buckets based on the input rand value.
	randRotateFar(tmpObj, rand, locn) {
		if (rand > 0.6666) {
			return;
		}


		this.randRotateClose(tmpObj, rand, locn);

		locn.x = locn.x * tmpObj.bucketDistRatio;

		locn.z = locn.z * tmpObj.bucketDistRatio;


	} // randRotateFar




    // Enables the starting of a target.
	enableStart(tmpObj, tobj) {
		tobj.timeEnabled = true;
		tobj.mesh.position.set(0, 0, tmpObj.targetFarDist);
		if (tobj.audioDefined) {
			const audio = tobj.mesh.children[0];
			if (audio.isPlaying) {
				audio.stop();
			}
			// audio.isPlaying = false;
			tobj.audioPlay = true;
		}
		tobj.collided = false;
	} // enableStart





    // Adjusts the end position using the current position of the player camera.
	postAdjustEndpos(tmpObj, endPos) {
		const cameraPos = new THREE.Vector3();
		tmpObj.realCamera.getWorldPosition(cameraPos);
		endPos.x = endPos.x + cameraPos.x;
		endPos.z = endPos.z + cameraPos.z;
	} // postAdjustEndpos
	
	
	
	
	// Returns a random-generated delay time to vary the periods between strategies and/or the periods between parts of strategies.
	xDeltaTime( flightTime )
	{
	    if( Math.random() < 0.3333333 )
	    {
	        const at0 = 0.8 * flightTime;
	        const at1 = 0.9 * flightTime;
	        const at2 = 1.0 * flightTime;
	        const rndd = Math.random();
	        if( rndd < 0.333333 )
	        {
	            return( at0 * Math.random() );
	        }
	        else if( rndd < 0.66666 )
	        {
	            const u = Math.random();
	            return( (1-u) * at0 + u * at1 );
	        }
	        else
	        {
	            const u = Math.random();
	            return( (1-u) * at1 + u * at2 );
	        }
	    }
	    else
	    {
	        return( 0 );
	    }
	} // xDeltaTime





} // Strategy











// A container for another set of strategies.
// NOTE: this is intended to be akin to an abstract class.  It has to be configured by another Strategy before use.
class ContainerStrategy extends Strategy {

    // Initializes an instance of the strategy.
	init(tmpObj, strtTimeI) {

		this.immediateSequence.init(tmpObj, strtTimeI);

		tmpObj.nextSequence = this.nextSequence;

	} // init

} // ContainerStrategy









// Strategy for a right hook to the head.
class RightHookHeadStrategy extends Strategy {


    // Initializes an instance of a segment of the strategy.
	initSegment(tmpObj, strtTimeI, randx, punchIndex) {

		const split2 = tmpObj.referenceTimeSplit;

		var strtTimeA = strtTimeI;

		{
			const startXA = 0.15;
			const tobj = tmpObj.targetsPunchA[ parseInt( punchIndex + 0 ) ];
			tobj.strtPos = new THREE.Vector3(startXA, tmpObj.offenseHeight * (tmpObj.hookHeadHeight / tmpObj.idealHumanHeadHeights ), tmpObj.backDistBucket);
			tobj.endPos = new THREE.Vector3(startXA, tmpObj.offenseHeight * (tmpObj.hookHeadHeight / tmpObj.idealHumanHeadHeights ), 0);
			tobj.strtTime = strtTimeA;
			tobj.endTime = parseInt(tobj.strtTime + tmpObj.flightTime);
			this.enableStart(tmpObj, tobj);
			this.randRotateFar(tmpObj, randx, tobj.strtPos);
			this.randRotateClose(tmpObj, randx, tobj.endPos);
			this.postAdjustEndpos(tmpObj, tobj.endPos);
		}

		{
			const startXA = 0.0;
			const tobj = tmpObj.targetsPunchA[ parseInt( punchIndex + 1 ) ];
			tobj.strtPos = new THREE.Vector3(startXA, tmpObj.offenseHeight * (tmpObj.hookHeadHeight / tmpObj.idealHumanHeadHeights ), tmpObj.backDistBucket);
			tobj.endPos = new THREE.Vector3(startXA, tmpObj.offenseHeight * (tmpObj.hookHeadHeight / tmpObj.idealHumanHeadHeights ), 0);
			tobj.strtTime = parseInt(strtTimeA + split2);
			tobj.endTime = parseInt(tobj.strtTime + tmpObj.flightTime);
			this.enableStart(tmpObj, tobj);
			this.randRotateFar(tmpObj, randx, tobj.strtPos);
			this.randRotateClose(tmpObj, randx, tobj.endPos);
			this.postAdjustEndpos(tmpObj, tobj.endPos);
		}

		{
			const startXA = -0.15;
			const tobj = tmpObj.targetsPunchA[ parseInt( punchIndex + 2 ) ];
			tobj.strtPos = new THREE.Vector3(startXA, tmpObj.offenseHeight * (tmpObj.hookHeadHeight / tmpObj.idealHumanHeadHeights ), tmpObj.backDistBucket);
			tobj.endPos = new THREE.Vector3(startXA, tmpObj.offenseHeight * (tmpObj.hookHeadHeight / tmpObj.idealHumanHeadHeights ), 0);
			tobj.strtTime = parseInt(strtTimeA + split2 + split2);
			tobj.endTime = parseInt(tobj.strtTime + tmpObj.flightTime);
			this.enableStart(tmpObj, tobj);
			this.randRotateFar(tmpObj, randx, tobj.strtPos);
			this.randRotateClose(tmpObj, randx, tobj.endPos);
			this.postAdjustEndpos(tmpObj, tobj.endPos);

			strtTimeA = tobj.endTime;
		}


		return( strtTimeA );
    } // initSegment



    // Initializes an instance of the strategy.
	init(tmpObj, strtTimeI) {

		const split2 = tmpObj.referenceTimeSplit;
		const randx = Math.random();

		var strtTimeA = strtTimeI;

		
		const stime = this.initSegment(tmpObj, strtTimeA, randx, 0);
		strtTimeA = parseInt(stime + this.xDeltaTime( tmpObj.flightTime ) );


		tmpObj.endTime = strtTimeA;
		tmpObj.dumbbellStrategy.initPotentialDisruptiveDumbbell(tmpObj, strtTimeI, tmpObj.endTime);

	} // init

} // RightHookHeadStrategy







// Strategy for a left hook to the head.
class LeftHookHeadStrategy extends Strategy {


    // Initializes an instance of a segment of the strategy.
	initSegment(tmpObj, strtTimeI, randx, punchIndex) {

		const split2 = tmpObj.referenceTimeSplit;

		var strtTimeA = strtTimeI;

		{
			const startXA = -0.15;
			const tobj = tmpObj.targetsPunchB[ parseInt( punchIndex + 0 ) ];
			tobj.strtPos = new THREE.Vector3(startXA, tmpObj.offenseHeight * (tmpObj.hookHeadHeight / tmpObj.idealHumanHeadHeights ), tmpObj.backDistBucket);
			tobj.endPos = new THREE.Vector3(startXA, tmpObj.offenseHeight * (tmpObj.hookHeadHeight / tmpObj.idealHumanHeadHeights ), 0);
			tobj.strtTime = strtTimeA;
			tobj.endTime = parseInt(tobj.strtTime + tmpObj.flightTime);
			this.enableStart(tmpObj, tobj);
			this.randRotateFar(tmpObj, randx, tobj.strtPos);
			this.randRotateClose(tmpObj, randx, tobj.endPos);
			this.postAdjustEndpos(tmpObj, tobj.endPos);
		}

		{
			const startXA = 0.0;
			const tobj = tmpObj.targetsPunchB[ parseInt( punchIndex + 1 ) ];
			tobj.strtPos = new THREE.Vector3(startXA, tmpObj.offenseHeight * (tmpObj.hookHeadHeight / tmpObj.idealHumanHeadHeights ), tmpObj.backDistBucket);
			tobj.endPos = new THREE.Vector3(startXA, tmpObj.offenseHeight * (tmpObj.hookHeadHeight / tmpObj.idealHumanHeadHeights ), 0);
			tobj.strtTime = parseInt(strtTimeA + split2);
			tobj.endTime = parseInt(tobj.strtTime + tmpObj.flightTime);
			this.enableStart(tmpObj, tobj);
			this.randRotateFar(tmpObj, randx, tobj.strtPos);
			this.randRotateClose(tmpObj, randx, tobj.endPos);
			this.postAdjustEndpos(tmpObj, tobj.endPos);
		}

		{
			const startXA = 0.15;
			const tobj = tmpObj.targetsPunchB[ parseInt( punchIndex + 2 ) ];
			tobj.strtPos = new THREE.Vector3(startXA, tmpObj.offenseHeight * (tmpObj.hookHeadHeight / tmpObj.idealHumanHeadHeights ), tmpObj.backDistBucket);
			tobj.endPos = new THREE.Vector3(startXA, tmpObj.offenseHeight * (tmpObj.hookHeadHeight / tmpObj.idealHumanHeadHeights ), 0);
			tobj.strtTime = parseInt(strtTimeA + split2 + split2);
			tobj.endTime = parseInt(tobj.strtTime + tmpObj.flightTime);
			this.enableStart(tmpObj, tobj);
			this.randRotateFar(tmpObj, randx, tobj.strtPos);
			this.randRotateClose(tmpObj, randx, tobj.endPos);
			this.postAdjustEndpos(tmpObj, tobj.endPos);

			strtTimeA = tobj.endTime;
		}


		return( strtTimeA );   
    }  // initSegment


    // Initializes an instance of the strategy.
	init(tmpObj, strtTimeI) {

		const split2 = tmpObj.referenceTimeSplit;
		const randx = Math.random();

		var strtTimeA = strtTimeI;

		
		const stime = this.initSegment(tmpObj, strtTimeA, randx, 0);
		strtTimeA = parseInt(stime + this.xDeltaTime( tmpObj.flightTime ));


		tmpObj.endTime = strtTimeA;
		tmpObj.dumbbellStrategy.initPotentialDisruptiveDumbbell(tmpObj, strtTimeI, tmpObj.endTime);

	} // init

} // LeftHookHeadStrategy







// Strategy for a right hook to the abdomen.
class RightHookAbdomenStrategy extends Strategy {

    // Initializes an instance of the strategy.
	init(tmpObj, strtTimeI) {

		const split2 = tmpObj.referenceTimeSplit;
		const randx = Math.random();

		var strtTimeA = strtTimeI;

		{
			const startXA = 0.0;
			const tobj = tmpObj.targetsPunchA[0];
			tobj.strtPos = new THREE.Vector3(startXA, tmpObj.offenseHeight * (tmpObj.abdomenHeight / tmpObj.idealHumanHeadHeights ), tmpObj.backDistBucket);
			tobj.endPos = new THREE.Vector3(startXA, tmpObj.offenseHeight * (tmpObj.abdomenHeight / tmpObj.idealHumanHeadHeights ), 0);
			tobj.strtTime = strtTimeA;
			tobj.endTime = parseInt(tobj.strtTime + tmpObj.flightTime);
			this.enableStart(tmpObj, tobj);
			this.randRotateFar(tmpObj, randx, tobj.strtPos);
			this.randRotateClose(tmpObj, randx, tobj.endPos);
			this.postAdjustEndpos(tmpObj, tobj.endPos);
		}

		{
			const startXA = -0.15;
			const tobj = tmpObj.targetsPunchA[1];
			tobj.strtPos = new THREE.Vector3(startXA, tmpObj.offenseHeight * (tmpObj.abdomenHeight / tmpObj.idealHumanHeadHeights ), tmpObj.backDistBucket);
			tobj.endPos = new THREE.Vector3(startXA, tmpObj.offenseHeight * (tmpObj.abdomenHeight / tmpObj.idealHumanHeadHeights ), 0);
			tobj.strtTime = parseInt(strtTimeA + split2);
			tobj.endTime = parseInt(tobj.strtTime + tmpObj.flightTime);
			this.enableStart(tmpObj, tobj);
			this.randRotateFar(tmpObj, randx, tobj.strtPos);
			this.randRotateClose(tmpObj, randx, tobj.endPos);
			this.postAdjustEndpos(tmpObj, tobj.endPos);
		}

		{
			const startXA = -0.30;
			const tobj = tmpObj.targetsPunchA[2];
			tobj.strtPos = new THREE.Vector3(startXA, tmpObj.offenseHeight * (tmpObj.abdomenHeight / tmpObj.idealHumanHeadHeights ), tmpObj.backDistBucket);
			tobj.endPos = new THREE.Vector3(startXA, tmpObj.offenseHeight * (tmpObj.abdomenHeight / tmpObj.idealHumanHeadHeights ), 0);
			tobj.strtTime = parseInt(strtTimeA + split2 + split2);
			tobj.endTime = parseInt(tobj.strtTime + tmpObj.flightTime);
			this.enableStart(tmpObj, tobj);
			this.randRotateFar(tmpObj, randx, tobj.strtPos);
			this.randRotateClose(tmpObj, randx, tobj.endPos);
			this.postAdjustEndpos(tmpObj, tobj.endPos);

			strtTimeA = parseInt(tobj.endTime + this.xDeltaTime( tmpObj.flightTime ));
		}


		tmpObj.endTime = strtTimeA;
		tmpObj.dumbbellStrategy.initPotentialDisruptiveDumbbell(tmpObj, strtTimeI, tmpObj.endTime);

	} // init
	

} // RightHookAbdomenStrategy







// Strategy for a left hook to the abdomen.
class LeftHookAbdomenStrategy extends Strategy {

    // Initializes an instance of the strategy.
	init(tmpObj, strtTimeI) {

		const split2 = tmpObj.referenceTimeSplit;
		const randx = Math.random();

		var strtTimeA = strtTimeI;

		{
			const startXA = 0.0;
			const tobj = tmpObj.targetsPunchB[0];
			tobj.strtPos = new THREE.Vector3(startXA, tmpObj.offenseHeight * (tmpObj.abdomenHeight / tmpObj.idealHumanHeadHeights ), tmpObj.backDistBucket);
			tobj.endPos = new THREE.Vector3(startXA, tmpObj.offenseHeight * (tmpObj.abdomenHeight / tmpObj.idealHumanHeadHeights ), 0);
			tobj.strtTime = strtTimeA;
			tobj.endTime = parseInt(tobj.strtTime + tmpObj.flightTime);
			this.enableStart(tmpObj, tobj);
			this.randRotateFar(tmpObj, randx, tobj.strtPos);
			this.randRotateClose(tmpObj, randx, tobj.endPos);
			this.postAdjustEndpos(tmpObj, tobj.endPos);
		}

		{
			const startXA = 0.15;
			const tobj = tmpObj.targetsPunchB[1];
			tobj.strtPos = new THREE.Vector3(startXA, tmpObj.offenseHeight * (tmpObj.abdomenHeight / tmpObj.idealHumanHeadHeights ), tmpObj.backDistBucket);
			tobj.endPos = new THREE.Vector3(startXA, tmpObj.offenseHeight * (tmpObj.abdomenHeight / tmpObj.idealHumanHeadHeights ), 0);
			tobj.strtTime = parseInt(strtTimeA + split2);
			tobj.endTime = parseInt(tobj.strtTime + tmpObj.flightTime);
			this.enableStart(tmpObj, tobj);
			this.randRotateFar(tmpObj, randx, tobj.strtPos);
			this.randRotateClose(tmpObj, randx, tobj.endPos);
			this.postAdjustEndpos(tmpObj, tobj.endPos);
		}

		{
			const startXA = 0.30;
			const tobj = tmpObj.targetsPunchB[2];
			tobj.strtPos = new THREE.Vector3(startXA, tmpObj.offenseHeight * (tmpObj.abdomenHeight / tmpObj.idealHumanHeadHeights ), tmpObj.backDistBucket);
			tobj.endPos = new THREE.Vector3(startXA, tmpObj.offenseHeight * (tmpObj.abdomenHeight / tmpObj.idealHumanHeadHeights ), 0);
			tobj.strtTime = parseInt(strtTimeA + split2 + split2);
			tobj.endTime = parseInt(tobj.strtTime + tmpObj.flightTime);
			this.enableStart(tmpObj, tobj);
			this.randRotateFar(tmpObj, randx, tobj.strtPos);
			this.randRotateClose(tmpObj, randx, tobj.endPos);
			this.postAdjustEndpos(tmpObj, tobj.endPos);

			strtTimeA = parseInt(tobj.endTime + this.xDeltaTime( tmpObj.flightTime ));
		}


		tmpObj.endTime = strtTimeA;
		tmpObj.dumbbellStrategy.initPotentialDisruptiveDumbbell(tmpObj, strtTimeI, tmpObj.endTime);

	} // init
	

} // LeftHookAbdomenStrategy






// Strategy for a right uppercut.
class RightUppercutStrategy extends Strategy {


    // Initializes an instance of a segment of the strategy.
	initSegment(tmpObj, strtTimeI, randx, punchIndex) {

		const split2 = tmpObj.referenceTimeSplit;
		const split3 = 0.75 * split2;

		var strtTimeA = strtTimeI;

		{
			const startXA = 0.08;
			const tobj = tmpObj.targetsPunchA[0 + punchIndex];
			tobj.strtPos = new THREE.Vector3(startXA, tmpObj.offenseHeight * (tmpObj.uppercutHeight / tmpObj.idealHumanHeadHeights ) - 2 * startXA, tmpObj.backDistBucket);
			tobj.endPos = new THREE.Vector3(startXA, tmpObj.offenseHeight * (tmpObj.uppercutHeight / tmpObj.idealHumanHeadHeights ) - 2 * startXA, 0);
			tobj.strtTime = strtTimeA;
			tobj.endTime = parseInt(tobj.strtTime + tmpObj.flightTime);
			this.enableStart(tmpObj, tobj);
			this.randRotateFar(tmpObj, randx, tobj.strtPos);
			this.randRotateClose(tmpObj, randx, tobj.endPos);
			this.postAdjustEndpos(tmpObj, tobj.endPos);
		}

		{
			const startXA = 0.0;
			const tobj = tmpObj.targetsPunchA[1 + punchIndex];
			tobj.strtPos = new THREE.Vector3(startXA, tmpObj.offenseHeight * (tmpObj.uppercutHeight / tmpObj.idealHumanHeadHeights ), tmpObj.backDistBucket);
			tobj.endPos = new THREE.Vector3(startXA, tmpObj.offenseHeight * (tmpObj.uppercutHeight / tmpObj.idealHumanHeadHeights ), 0);
			tobj.strtTime = parseInt(strtTimeA + split3);
			tobj.endTime = parseInt(tobj.strtTime + tmpObj.flightTime);
			this.enableStart(tmpObj, tobj);
			this.randRotateFar(tmpObj, randx, tobj.strtPos);
			this.randRotateClose(tmpObj, randx, tobj.endPos);
			this.postAdjustEndpos(tmpObj, tobj.endPos);
		}

		{
			const startXA = -0.08;
			const tobj = tmpObj.targetsPunchA[2 + punchIndex];
			tobj.strtPos = new THREE.Vector3(startXA, tmpObj.offenseHeight * (tmpObj.uppercutHeight / tmpObj.idealHumanHeadHeights ) - 2 * startXA, tmpObj.backDistBucket);
			tobj.endPos = new THREE.Vector3(startXA, tmpObj.offenseHeight * (tmpObj.uppercutHeight / tmpObj.idealHumanHeadHeights ) - 2 * startXA, 0);
			tobj.strtTime = parseInt(strtTimeA + split3 + split3);
			tobj.endTime = parseInt(tobj.strtTime + tmpObj.flightTime);
			this.enableStart(tmpObj, tobj);
			this.randRotateFar(tmpObj, randx, tobj.strtPos);
			this.randRotateClose(tmpObj, randx, tobj.endPos);
			this.postAdjustEndpos(tmpObj, tobj.endPos);
		}

	} // initSegment



    // Initializes an instance of the strategy.
	init(tmpObj, strtTimeI) {

		const split2 = tmpObj.referenceTimeSplit;
		const split3 = 0.75 * split2;
		const randx = Math.random();

		var strtTimeA = strtTimeI;

		this.initSegment(tmpObj, strtTimeI, randx, 0);

		strtTimeA = parseInt(strtTimeA + split3 + split3 + tmpObj.flightTime + this.xDeltaTime( tmpObj.flightTime ));


		tmpObj.endTime = strtTimeA;
		tmpObj.dumbbellStrategy.initPotentialDisruptiveDumbbell(tmpObj, strtTimeI, tmpObj.endTime);

	} // init

} // RightUppercutStrategy







// Strategy for a left uppercut.
class LeftUppercutStrategy extends Strategy {


    // Initializes an instance of a segment of the strategy.
	initSegment(tmpObj, strtTimeI, randx, punchIndex) {

		const split2 = tmpObj.referenceTimeSplit;
		const split3 = 0.75 * split2;

		var strtTimeA = strtTimeI;

		{
			const startXA = -0.08;
			const tobj = tmpObj.targetsPunchB[0 + punchIndex];
			tobj.strtPos = new THREE.Vector3(startXA, tmpObj.offenseHeight * (tmpObj.uppercutHeight / tmpObj.idealHumanHeadHeights ) + 2 * startXA, tmpObj.backDistBucket);
			tobj.endPos = new THREE.Vector3(startXA, tmpObj.offenseHeight * (tmpObj.uppercutHeight / tmpObj.idealHumanHeadHeights ) + 2 * startXA, 0);
			tobj.strtTime = strtTimeA;
			tobj.endTime = parseInt(tobj.strtTime + tmpObj.flightTime);
			this.enableStart(tmpObj, tobj);
			this.randRotateFar(tmpObj, randx, tobj.strtPos);
			this.randRotateClose(tmpObj, randx, tobj.endPos);
			this.postAdjustEndpos(tmpObj, tobj.endPos);
		}

		{
			const startXA = 0.0;
			const tobj = tmpObj.targetsPunchB[1 + punchIndex];
			tobj.strtPos = new THREE.Vector3(startXA, tmpObj.offenseHeight * (tmpObj.uppercutHeight / tmpObj.idealHumanHeadHeights ), tmpObj.backDistBucket);
			tobj.endPos = new THREE.Vector3(startXA, tmpObj.offenseHeight * (tmpObj.uppercutHeight / tmpObj.idealHumanHeadHeights ), 0);
			tobj.strtTime = parseInt(strtTimeA + split3);
			tobj.endTime = parseInt(tobj.strtTime + tmpObj.flightTime);
			this.enableStart(tmpObj, tobj);
			this.randRotateFar(tmpObj, randx, tobj.strtPos);
			this.randRotateClose(tmpObj, randx, tobj.endPos);
			this.postAdjustEndpos(tmpObj, tobj.endPos);
		}

		{
			const startXA = 0.08;
			const tobj = tmpObj.targetsPunchB[2 + punchIndex];
			tobj.strtPos = new THREE.Vector3(startXA, tmpObj.offenseHeight * (tmpObj.uppercutHeight / tmpObj.idealHumanHeadHeights ) + 2 * startXA, tmpObj.backDistBucket);
			tobj.endPos = new THREE.Vector3(startXA, tmpObj.offenseHeight * (tmpObj.uppercutHeight / tmpObj.idealHumanHeadHeights ) + 2 * startXA, 0);
			tobj.strtTime = parseInt(strtTimeA + split3 + split3);
			tobj.endTime = parseInt(tobj.strtTime + tmpObj.flightTime);
			this.enableStart(tmpObj, tobj);
			this.randRotateFar(tmpObj, randx, tobj.strtPos);
			this.randRotateClose(tmpObj, randx, tobj.endPos);
			this.postAdjustEndpos(tmpObj, tobj.endPos);
		}

	} // initSegment




    // Initializes an instance of the strategy.
	init(tmpObj, strtTimeI) {

		const split2 = tmpObj.referenceTimeSplit;
		const split3 = 0.75 * split2;
		const randx = Math.random();

		var strtTimeA = strtTimeI;

		this.initSegment(tmpObj, strtTimeI, randx, 0);

		strtTimeA = parseInt(strtTimeA + split3 + split3 + tmpObj.flightTime + this.xDeltaTime( tmpObj.flightTime ));


		tmpObj.endTime = strtTimeA;
		tmpObj.dumbbellStrategy.initPotentialDisruptiveDumbbell(tmpObj, strtTimeI, tmpObj.endTime);

	} // init

} // LeftUppercutStrategy






// Strategy for a right uppercut jump.
class RightUppercutJumpStrategy extends Strategy {

    // Initializes an instance of the strategy.
	init(tmpObj, strtTimeI) {

		const split2 = tmpObj.referenceTimeSplit;
		const split3 = 0.75 * split2;
		const randx = Math.random();

		var strtTimeA = strtTimeI;

		{
			const tobj = tmpObj.jumpHurdlesA[0];
			tobj.strtPos = new THREE.Vector3(0.0, tmpObj.jumpHurdleHeight, tmpObj.backDistBucket);
			tobj.endPos = new THREE.Vector3(0.0, tmpObj.jumpHurdleHeight, 0);
			tobj.strtTime = strtTimeA;
			tobj.endTime = parseInt(tobj.strtTime + tmpObj.flightTime);
			this.enableStart(tmpObj, tobj);
			this.randRotateFar(tmpObj, randx, tobj.strtPos);
			this.randRotateClose(tmpObj, randx, tobj.endPos);
			this.postAdjustEndpos(tmpObj, tobj.endPos);
		}

		{
			const startXA = 0.08;
			const tobj = tmpObj.targetsPunchA[0];
			tobj.strtPos = new THREE.Vector3(startXA, tmpObj.offenseHeight * (tmpObj.uppercutJumpHeight / tmpObj.idealHumanHeadHeights ) - 2 * startXA, tmpObj.backDistBucket);
			tobj.endPos = new THREE.Vector3(startXA, tmpObj.offenseHeight * (tmpObj.uppercutJumpHeight / tmpObj.idealHumanHeadHeights ) - 2 * startXA, 0);
			tobj.strtTime = strtTimeA;
			tobj.endTime = parseInt(tobj.strtTime + tmpObj.flightTime);
			this.enableStart(tmpObj, tobj);
			this.randRotateFar(tmpObj, randx, tobj.strtPos);
			this.randRotateClose(tmpObj, randx, tobj.endPos);
			this.postAdjustEndpos(tmpObj, tobj.endPos);
		}

		{
			const startXA = 0.0;
			const tobj = tmpObj.targetsPunchA[1];
			tobj.strtPos = new THREE.Vector3(startXA, tmpObj.offenseHeight * (tmpObj.uppercutJumpHeight / tmpObj.idealHumanHeadHeights ), tmpObj.backDistBucket);
			tobj.endPos = new THREE.Vector3(startXA, tmpObj.offenseHeight * (tmpObj.uppercutJumpHeight / tmpObj.idealHumanHeadHeights ), 0);
			tobj.strtTime = parseInt(strtTimeA + split3);
			tobj.endTime = parseInt(tobj.strtTime + tmpObj.flightTime);
			this.enableStart(tmpObj, tobj);
			this.randRotateFar(tmpObj, randx, tobj.strtPos);
			this.randRotateClose(tmpObj, randx, tobj.endPos);
			this.postAdjustEndpos(tmpObj, tobj.endPos);
		}

		{
			const startXA = -0.08;
			const tobj = tmpObj.targetsPunchA[2];
			tobj.strtPos = new THREE.Vector3(startXA, tmpObj.offenseHeight * (tmpObj.uppercutJumpHeight / tmpObj.idealHumanHeadHeights ) - 2 * startXA, tmpObj.backDistBucket);
			tobj.endPos = new THREE.Vector3(startXA, tmpObj.offenseHeight * (tmpObj.uppercutJumpHeight / tmpObj.idealHumanHeadHeights ) - 2 * startXA, 0);
			tobj.strtTime = parseInt(strtTimeA + split3 + split3);
			tobj.endTime = parseInt(tobj.strtTime + tmpObj.flightTime);
			this.enableStart(tmpObj, tobj);
			this.randRotateFar(tmpObj, randx, tobj.strtPos);
			this.randRotateClose(tmpObj, randx, tobj.endPos);
			this.postAdjustEndpos(tmpObj, tobj.endPos);

			strtTimeA = parseInt(tobj.endTime + this.xDeltaTime( tmpObj.flightTime ));
		}


		tmpObj.endTime = strtTimeA;
		tmpObj.dumbbellStrategy.initPotentialDisruptiveDumbbell(tmpObj, strtTimeI, tmpObj.endTime);

	} // init
	

} // RightUppercutJumpStrategy







// Strategy for a left uppercut jump.
class LeftUppercutJumpStrategy extends Strategy {

    // Initializes an instance of the strategy.
	init(tmpObj, strtTimeI) {

		const split2 = tmpObj.referenceTimeSplit;
		const split3 = 0.75 * split2;
		const randx = Math.random();

		var strtTimeA = strtTimeI;

		{
			const tobj = tmpObj.jumpHurdlesA[0];
			tobj.strtPos = new THREE.Vector3(0.0, tmpObj.jumpHurdleHeight, tmpObj.backDistBucket);
			tobj.endPos = new THREE.Vector3(0.0, tmpObj.jumpHurdleHeight, 0);
			tobj.strtTime = strtTimeA;
			tobj.endTime = parseInt(tobj.strtTime + tmpObj.flightTime);
			this.enableStart(tmpObj, tobj);
			this.randRotateFar(tmpObj, randx, tobj.strtPos);
			this.randRotateClose(tmpObj, randx, tobj.endPos);
			this.postAdjustEndpos(tmpObj, tobj.endPos);
		}

		{
			const startXA = -0.08;
			const tobj = tmpObj.targetsPunchB[0];
			tobj.strtPos = new THREE.Vector3(startXA, tmpObj.offenseHeight * (tmpObj.uppercutJumpHeight / tmpObj.idealHumanHeadHeights ) + 2 * startXA, tmpObj.backDistBucket);
			tobj.endPos = new THREE.Vector3(startXA, tmpObj.offenseHeight * (tmpObj.uppercutJumpHeight / tmpObj.idealHumanHeadHeights ) + 2 * startXA, 0);
			tobj.strtTime = strtTimeA;
			tobj.endTime = parseInt(tobj.strtTime + tmpObj.flightTime);
			this.enableStart(tmpObj, tobj);
			this.randRotateFar(tmpObj, randx, tobj.strtPos);
			this.randRotateClose(tmpObj, randx, tobj.endPos);
			this.postAdjustEndpos(tmpObj, tobj.endPos);
		}

		{
			const startXA = 0.0;
			const tobj = tmpObj.targetsPunchB[1];
			tobj.strtPos = new THREE.Vector3(startXA, tmpObj.offenseHeight * (tmpObj.uppercutJumpHeight / tmpObj.idealHumanHeadHeights ), tmpObj.backDistBucket);
			tobj.endPos = new THREE.Vector3(startXA, tmpObj.offenseHeight * (tmpObj.uppercutJumpHeight / tmpObj.idealHumanHeadHeights ), 0);
			tobj.strtTime = parseInt(strtTimeA + split3);
			tobj.endTime = parseInt(tobj.strtTime + tmpObj.flightTime);
			this.enableStart(tmpObj, tobj);
			this.randRotateFar(tmpObj, randx, tobj.strtPos);
			this.randRotateClose(tmpObj, randx, tobj.endPos);
			this.postAdjustEndpos(tmpObj, tobj.endPos);
		}

		{
			const startXA = 0.08;
			const tobj = tmpObj.targetsPunchB[2];
			tobj.strtPos = new THREE.Vector3(startXA, tmpObj.offenseHeight * (tmpObj.uppercutJumpHeight / tmpObj.idealHumanHeadHeights ) + 2 * startXA, tmpObj.backDistBucket);
			tobj.endPos = new THREE.Vector3(startXA, tmpObj.offenseHeight * (tmpObj.uppercutJumpHeight / tmpObj.idealHumanHeadHeights ) + 2 * startXA, 0);
			tobj.strtTime = parseInt(strtTimeA + split3 + split3);
			tobj.endTime = parseInt(tobj.strtTime + tmpObj.flightTime);
			this.enableStart(tmpObj, tobj);
			this.randRotateFar(tmpObj, randx, tobj.strtPos);
			this.randRotateClose(tmpObj, randx, tobj.endPos);
			this.postAdjustEndpos(tmpObj, tobj.endPos);

			strtTimeA = parseInt(tobj.endTime + this.xDeltaTime( tmpObj.flightTime ));
		}


		tmpObj.endTime = strtTimeA;
		tmpObj.dumbbellStrategy.initPotentialDisruptiveDumbbell(tmpObj, strtTimeI, tmpObj.endTime);

	} // init
	

} // LeftUppercutJumpStrategy










// Strategy for a right punch-down jump.
class RightPunchDownJumpStrategy extends Strategy {

    // Initializes an instance of the strategy.
	init(tmpObj, strtTimeI) {

		const split2 = tmpObj.referenceTimeSplit;
		const randx = Math.random();
		const split3 = 0.75 * split2;

		var strtTimeA = strtTimeI;

		{
			const tobj = tmpObj.jumpHurdlesA[0];
			tobj.strtPos = new THREE.Vector3(0.0, tmpObj.jumpHurdleHeight, tmpObj.backDistBucket);
			tobj.endPos = new THREE.Vector3(0.0, tmpObj.jumpHurdleHeight, 0);
			tobj.strtTime = strtTimeA;
			tobj.endTime = parseInt(tobj.strtTime + tmpObj.flightTimeKick);
			this.enableStart(tmpObj, tobj);
			this.randRotateFar(tmpObj, randx, tobj.strtPos);
			this.randRotateClose(tmpObj, randx, tobj.endPos);
			this.postAdjustEndpos(tmpObj, tobj.endPos);
			strtTimeA = strtTimeA + split2;
		}

		{
			const startXA = 0.08;
			const tobj = tmpObj.targetsPunchA[0];
			tobj.strtPos = new THREE.Vector3(startXA, tmpObj.offenseHeight * (tmpObj.abdomenHeight / tmpObj.idealHumanHeadHeights ) + 2 * startXA, tmpObj.backDistBucket);
			tobj.endPos = new THREE.Vector3(startXA, tmpObj.offenseHeight * (tmpObj.abdomenHeight / tmpObj.idealHumanHeadHeights ) + 2 * startXA, 0);
			tobj.strtTime = strtTimeA;
			tobj.endTime = parseInt(tobj.strtTime + tmpObj.flightTimeKick);
			this.enableStart(tmpObj, tobj);
			this.randRotateFar(tmpObj, randx, tobj.strtPos);
			this.randRotateClose(tmpObj, randx, tobj.endPos);
			this.postAdjustEndpos(tmpObj, tobj.endPos);
		}

		{
			const startXA = 0.0;
			const tobj = tmpObj.targetsPunchA[1];
			tobj.strtPos = new THREE.Vector3(startXA, tmpObj.offenseHeight * (tmpObj.abdomenHeight / tmpObj.idealHumanHeadHeights ), tmpObj.backDistBucket);
			tobj.endPos = new THREE.Vector3(startXA, tmpObj.offenseHeight * (tmpObj.abdomenHeight / tmpObj.idealHumanHeadHeights ), 0);
			tobj.strtTime = parseInt(strtTimeA + split3);
			tobj.endTime = parseInt(tobj.strtTime + tmpObj.flightTimeKick);
			this.enableStart(tmpObj, tobj);
			this.randRotateFar(tmpObj, randx, tobj.strtPos);
			this.randRotateClose(tmpObj, randx, tobj.endPos);
			this.postAdjustEndpos(tmpObj, tobj.endPos);
		}

		{
			const startXA = -0.08;
			const tobj = tmpObj.targetsPunchA[2];
			tobj.strtPos = new THREE.Vector3(startXA, tmpObj.offenseHeight * (tmpObj.abdomenHeight / tmpObj.idealHumanHeadHeights ) + 2 * startXA, tmpObj.backDistBucket);
			tobj.endPos = new THREE.Vector3(startXA, tmpObj.offenseHeight * (tmpObj.abdomenHeight / tmpObj.idealHumanHeadHeights ) + 2 * startXA, 0);
			tobj.strtTime = parseInt(strtTimeA + split3 + split3);
			tobj.endTime = parseInt(tobj.strtTime + tmpObj.flightTimeKick);
			this.enableStart(tmpObj, tobj);
			this.randRotateFar(tmpObj, randx, tobj.strtPos);
			this.randRotateClose(tmpObj, randx, tobj.endPos);
			this.postAdjustEndpos(tmpObj, tobj.endPos);

			strtTimeA = parseInt(tobj.endTime + this.xDeltaTime( tmpObj.flightTimeKick ));
		}


		tmpObj.endTime = strtTimeA;
		tmpObj.dumbbellStrategy.initPotentialDisruptiveDumbbell(tmpObj, strtTimeI, tmpObj.endTime);

	}  // init
	

} // RightPunchDownJumpStrategy







// Strategy for a left punch-down jump.
class LeftPunchDownJumpStrategy extends Strategy {

    // Initializes an instance of the strategy.
	init(tmpObj, strtTimeI) {

		const split2 = tmpObj.referenceTimeSplit;
		const randx = Math.random();
		const split3 = 0.75 * split2;

		var strtTimeA = strtTimeI;

		{
			const tobj = tmpObj.jumpHurdlesA[0];
			tobj.strtPos = new THREE.Vector3(0.0, tmpObj.jumpHurdleHeight, tmpObj.backDistBucket);
			tobj.endPos = new THREE.Vector3(0.0, tmpObj.jumpHurdleHeight, 0);
			tobj.strtTime = strtTimeA;
			tobj.endTime = parseInt(tobj.strtTime + tmpObj.flightTimeKick);
			this.enableStart(tmpObj, tobj);
			this.randRotateFar(tmpObj, randx, tobj.strtPos);
			this.randRotateClose(tmpObj, randx, tobj.endPos);
			this.postAdjustEndpos(tmpObj, tobj.endPos);
			strtTimeA = strtTimeA + split2;
		}

		{
			const startXA = -0.08;
			const tobj = tmpObj.targetsPunchB[0];
			tobj.strtPos = new THREE.Vector3(startXA, tmpObj.offenseHeight * (tmpObj.abdomenHeight / tmpObj.idealHumanHeadHeights ) - 2 * startXA, tmpObj.backDistBucket);
			tobj.endPos = new THREE.Vector3(startXA, tmpObj.offenseHeight * (tmpObj.abdomenHeight / tmpObj.idealHumanHeadHeights ) - 2 * startXA, 0);
			tobj.strtTime = strtTimeA;
			tobj.endTime = parseInt(tobj.strtTime + tmpObj.flightTimeKick);
			this.enableStart(tmpObj, tobj);
			this.randRotateFar(tmpObj, randx, tobj.strtPos);
			this.randRotateClose(tmpObj, randx, tobj.endPos);
			this.postAdjustEndpos(tmpObj, tobj.endPos);
		}

		{
			const startXA = 0.0;
			const tobj = tmpObj.targetsPunchB[1];
			tobj.strtPos = new THREE.Vector3(startXA, tmpObj.offenseHeight * (tmpObj.abdomenHeight / tmpObj.idealHumanHeadHeights ), tmpObj.backDistBucket);
			tobj.endPos = new THREE.Vector3(startXA, tmpObj.offenseHeight * (tmpObj.abdomenHeight / tmpObj.idealHumanHeadHeights ), 0);
			tobj.strtTime = parseInt(strtTimeA + split3);
			tobj.endTime = parseInt(tobj.strtTime + tmpObj.flightTimeKick);
			this.enableStart(tmpObj, tobj);
			this.randRotateFar(tmpObj, randx, tobj.strtPos);
			this.randRotateClose(tmpObj, randx, tobj.endPos);
			this.postAdjustEndpos(tmpObj, tobj.endPos);
		}

		{
			const startXA = 0.08;
			const tobj = tmpObj.targetsPunchB[2];
			tobj.strtPos = new THREE.Vector3(startXA, tmpObj.offenseHeight * (tmpObj.abdomenHeight / tmpObj.idealHumanHeadHeights ) - 2 * startXA, tmpObj.backDistBucket);
			tobj.endPos = new THREE.Vector3(startXA, tmpObj.offenseHeight * (tmpObj.abdomenHeight / tmpObj.idealHumanHeadHeights ) - 2 * startXA, 0);
			tobj.strtTime = parseInt(strtTimeA + split3 + split3);
			tobj.endTime = parseInt(tobj.strtTime + tmpObj.flightTimeKick);
			this.enableStart(tmpObj, tobj);
			this.randRotateFar(tmpObj, randx, tobj.strtPos);
			this.randRotateClose(tmpObj, randx, tobj.endPos);
			this.postAdjustEndpos(tmpObj, tobj.endPos);

			strtTimeA = parseInt(tobj.endTime + this.xDeltaTime( tmpObj.flightTimeKick ));
		}


		tmpObj.endTime = strtTimeA;
		tmpObj.dumbbellStrategy.initPotentialDisruptiveDumbbell(tmpObj, strtTimeI, tmpObj.endTime);

	} // init
	

} // LeftPunchDownJumpStrategy











// Strategy for generating a random set of targets to block.
class RandomStrategy extends Strategy {

    // Initializes an instance of the strategy.
	init(tmpObj, strtTimeI) {

		const split2 = tmpObj.randomStrategyTimeSplit;

		var strtTimeA = strtTimeI;
		var strtTimeB = parseInt(strtTimeI + split2);

		{
			const height = (0.5 + Math.random() / 2) * (tmpObj.defenseHeight);
			const startXA = Math.random() < 0.5 ? 0.0 : tmpObj.bucketXOffset;
			const tobj = tmpObj.targetsPunchA[0];
			tobj.strtPos = new THREE.Vector3(startXA, height, tmpObj.backDistBucket);
			tobj.endPos = new THREE.Vector3(0, height, 0);
			tobj.strtTime = strtTimeA;
			tobj.endTime = parseInt(tobj.strtTime + tmpObj.flightTimeStraightPunch);
			this.postAdjustEndpos(tmpObj, tobj.endPos);
			this.enableStart(tmpObj, tobj);

			strtTimeA = parseInt(tobj.endTime + this.xDeltaTime( tmpObj.flightTimeStraightPunch ));
		}

		{
			const height = (0.5 + Math.random() / 2) * (tmpObj.defenseHeight);
			const startXB = Math.random() < 0.5 ? 0.0 : -tmpObj.bucketXOffset;
			const tobj = tmpObj.targetsPunchB[0];
			tobj.strtPos = new THREE.Vector3(startXB, height, tmpObj.backDistBucket);
			tobj.endPos = new THREE.Vector3(0, height, 0);
			tobj.strtTime = strtTimeB;
			tobj.endTime = parseInt(tobj.strtTime + tmpObj.flightTimeStraightPunch);
			this.postAdjustEndpos(tmpObj, tobj.endPos);
			this.enableStart(tmpObj, tobj);

			strtTimeB = parseInt(tobj.endTime + this.xDeltaTime( tmpObj.flightTimeStraightPunch ));
		}


		{
			const height = (0.5 + Math.random() / 2) * (tmpObj.defenseHeight);
			const startXA = Math.random() < 0.5 ? 0.0 : tmpObj.bucketXOffset;
			const tobj = tmpObj.targetsPunchA[1];
			tobj.strtPos = new THREE.Vector3(startXA, height, tmpObj.backDistBucket);
			tobj.endPos = new THREE.Vector3(0, height, 0);
			tobj.strtTime = strtTimeA;
			tobj.endTime = parseInt(tobj.strtTime + tmpObj.flightTimeStraightPunch);
			this.postAdjustEndpos(tmpObj, tobj.endPos);
			this.enableStart(tmpObj, tobj);

			strtTimeA = parseInt(tobj.endTime + this.xDeltaTime( tmpObj.flightTimeStraightPunch ));
		}

		{
			const height = (0.5 + Math.random() / 2) * (tmpObj.defenseHeight);
			const startXB = Math.random() < 0.5 ? 0.0 : -tmpObj.bucketXOffset;
			const tobj = tmpObj.targetsPunchB[1];
			tobj.strtPos = new THREE.Vector3(startXB, height, tmpObj.backDistBucket);
			tobj.endPos = new THREE.Vector3(0, height, 0);
			tobj.strtTime = strtTimeB;
			tobj.endTime = parseInt(tobj.strtTime + tmpObj.flightTimeStraightPunch);
			this.postAdjustEndpos(tmpObj, tobj.endPos);
			this.enableStart(tmpObj, tobj);

			strtTimeB = parseInt(tobj.endTime + this.xDeltaTime( tmpObj.flightTimeStraightPunch ));
		}

		{
			const height = (0.5 + Math.random() / 2) * (tmpObj.defenseHeight);
			const startXA = Math.random() < 0.5 ? 0.0 : tmpObj.bucketXOffset;
			const tobj = tmpObj.targetsPunchA[2];
			tobj.strtPos = new THREE.Vector3(startXA, height, tmpObj.backDistBucket);
			tobj.endPos = new THREE.Vector3(0, height, 0);
			tobj.strtTime = strtTimeA;
			tobj.endTime = parseInt(tobj.strtTime + tmpObj.flightTimeStraightPunch);
			this.postAdjustEndpos(tmpObj, tobj.endPos);
			this.enableStart(tmpObj, tobj);

			strtTimeA = parseInt(tobj.endTime + this.xDeltaTime( tmpObj.flightTimeStraightPunch ));
		}

		{
			const height = (0.5 + Math.random() / 2) * (tmpObj.defenseHeight);
			const startXB = Math.random() < 0.5 ? 0.0 : -tmpObj.bucketXOffset;
			const tobj = tmpObj.targetsPunchB[2];
			tobj.strtPos = new THREE.Vector3(startXB, height, tmpObj.backDistBucket);
			tobj.endPos = new THREE.Vector3(0, height, 0);
			tobj.strtTime = strtTimeB;
			tobj.endTime = parseInt(tobj.strtTime + tmpObj.flightTimeStraightPunch);
			this.postAdjustEndpos(tmpObj, tobj.endPos);
			this.enableStart(tmpObj, tobj);

			strtTimeB = parseInt(tobj.endTime + this.xDeltaTime( tmpObj.flightTimeStraightPunch ));
		}


		tmpObj.endTime = strtTimeA;
		if (strtTimeB > strtTimeA) {
			tmpObj.endTime = strtTimeB;
		}
		tmpObj.dumbbellStrategy.initPotentialDisruptiveDumbbell(tmpObj, strtTimeI, tmpObj.endTime);


	} // init
	

} // RandomStrategy





// Strategy for staying in position to protect one's guard.
class ProtectGuardStrategy extends Strategy {

    // Initializes an instance of the strategy.
	init(tmpObj, strtTimeI) {

		const split2 = tmpObj.referenceTimeSplit;

		var strtTimeA = strtTimeI;
		var strtTimeB = strtTimeI;

		{
			const startXA = Math.random() < 0.5 ? 0.08 : tmpObj.bucketXOffset;
			const tobj = tmpObj.targetsPunchA[0];
			tobj.strtPos = new THREE.Vector3(startXA, tmpObj.defenseHeight - 0.16, tmpObj.backDistBucket);
			tobj.endPos = new THREE.Vector3(0.08, tmpObj.defenseHeight - 0.16, 0);
			tobj.strtTime = strtTimeA;
			tobj.endTime = parseInt(tobj.strtTime + tmpObj.flightTime);
			this.postAdjustEndpos(tmpObj, tobj.endPos);
			this.enableStart(tmpObj, tobj);

			strtTimeA = parseInt(tobj.endTime + this.xDeltaTime( tmpObj.flightTime ));
		}

		{
			const startXB = Math.random() < 0.5 ? -0.08 : -tmpObj.bucketXOffset;
			const tobj = tmpObj.targetsPunchB[0];
			tobj.strtPos = new THREE.Vector3(startXB, tmpObj.defenseHeight - 0.16, tmpObj.backDistBucket);
			tobj.endPos = new THREE.Vector3(-0.08, tmpObj.defenseHeight - 0.16, 0);
			tobj.strtTime = strtTimeB;
			tobj.endTime = parseInt(tobj.strtTime + tmpObj.flightTime);
			this.postAdjustEndpos(tmpObj, tobj.endPos);
			this.enableStart(tmpObj, tobj);

			strtTimeB = tobj.endTime;
		}



		tmpObj.endTime = strtTimeA;
		if (strtTimeB > strtTimeA) {
			tmpObj.endTime = strtTimeB;
		}
		tmpObj.dumbbellStrategy.initPotentialDisruptiveDumbbell(tmpObj, strtTimeI, tmpObj.endTime);


	} // init
	

} // ProtectGuardStrategy





// Strategy for an upper cross-block to protect from a hammer strike.
class ProtectHammerStrikeStrategy extends Strategy {

    // Initializes an instance of the strategy.
	init(tmpObj, strtTimeI) {

		const split2 = tmpObj.referenceTimeSplit;

		var strtTimeA = strtTimeI;
		var strtTimeB = strtTimeI;

		{
			const insideI = Math.random() < 0.5;
			const startXA = insideI ? 0.08 : tmpObj.bucketXOffset;
			const startYA = insideI ? tmpObj.defenseHeight - 0.16 - 0.25 * tmpObj.backDistBucket :
				tmpObj.defenseHeight - 0.16 + 0.25 * tmpObj.bucketHypotenuse;
			const tobj = tmpObj.targetsPunchB[0];
			tobj.strtPos = new THREE.Vector3(startXA, startYA, tmpObj.backDistBucket);
			tobj.endPos = new THREE.Vector3(0.08, tmpObj.defenseHeight - 0.16, 0);
			tobj.strtTime = strtTimeA;
			tobj.endTime = parseInt(tobj.strtTime + tmpObj.flightTime);
			this.postAdjustEndpos(tmpObj, tobj.endPos);
			this.enableStart(tmpObj, tobj);

			strtTimeA = parseInt(tobj.endTime + this.xDeltaTime( tmpObj.flightTime ));
		}

		{
			const insideI = Math.random() < 0.5;
			const startXB = insideI ? -0.08 : -tmpObj.bucketXOffset;
			const startYB = insideI ? tmpObj.defenseHeight - 0.16 - 0.25 * tmpObj.backDistBucket :
				tmpObj.defenseHeight - 0.16 + 0.25 * tmpObj.bucketHypotenuse;
			const tobj = tmpObj.targetsPunchA[0];
			tobj.strtPos = new THREE.Vector3(startXB, startYB, tmpObj.backDistBucket);
			tobj.endPos = new THREE.Vector3(-0.08, tmpObj.defenseHeight - 0.16, 0);
			tobj.strtTime = strtTimeB;
			tobj.endTime = parseInt(tobj.strtTime + tmpObj.flightTime);
			this.postAdjustEndpos(tmpObj, tobj.endPos);
			this.enableStart(tmpObj, tobj);

			strtTimeB = tobj.endTime;
		}



		tmpObj.endTime = strtTimeA;
		if (strtTimeB > strtTimeA) {
			tmpObj.endTime = strtTimeB;
		}


	} // init
	

} // ProtectHammerStrikeStrategy






// Strategy for a front-ball kick to the abdomen from the right.  The targets show the target of the kick only.
class RightFrontKickAbdomenStrategy extends Strategy {



    // Initializes an instance of a segment of the strategy.
	initSegment(tmpObj, strtTimeI, randx, kickIndex) {

		const split2 = tmpObj.referenceTimeSplit;

		var strtTimeA = strtTimeI;


		{
			const startXA = 0.16;
			const tobj = tmpObj.targetsKickA[ parseInt( kickIndex+0) ];
			tobj.strtPos = new THREE.Vector3(startXA, tmpObj.offenseHeight * (tmpObj.abdomenHeight / tmpObj.idealHumanHeadHeights ), tmpObj.backDistBucket);
			tobj.endPos = new THREE.Vector3(startXA, tmpObj.offenseHeight * (tmpObj.abdomenHeight / tmpObj.idealHumanHeadHeights ), 0);
			tobj.strtTime = strtTimeA;
			tobj.endTime = parseInt(tobj.strtTime + tmpObj.flightTimeKick);
			this.enableStart(tmpObj, tobj);
			this.randRotateFar(tmpObj, randx, tobj.strtPos);
			this.randRotateClose(tmpObj, randx, tobj.endPos);
			this.postAdjustEndpos(tmpObj, tobj.endPos);
		}

		{
			const startXA = 0.16;
			const tobj = tmpObj.targetsKickA[ parseInt( kickIndex+1) ];
			tobj.strtPos = new THREE.Vector3(startXA, tmpObj.offenseHeight * (tmpObj.abdomenHeight / tmpObj.idealHumanHeadHeights ), tmpObj.backDistBucket);
			tobj.endPos = new THREE.Vector3(startXA, tmpObj.offenseHeight * (tmpObj.abdomenHeight / tmpObj.idealHumanHeadHeights ), 0);
			tobj.strtTime = parseInt(strtTimeA + split2);
			tobj.endTime = parseInt(tobj.strtTime + tmpObj.flightTimeKick);
			this.enableStart(tmpObj, tobj);
			this.randRotateFar(tmpObj, randx, tobj.strtPos);
			this.randRotateClose(tmpObj, randx, tobj.endPos);
			this.postAdjustEndpos(tmpObj, tobj.endPos);
		}

		{
			const startXA = 0.16;
			const tobj = tmpObj.targetsKickA[ parseInt( kickIndex+2) ];
			tobj.strtPos = new THREE.Vector3(startXA, tmpObj.offenseHeight * (tmpObj.abdomenHeight / tmpObj.idealHumanHeadHeights ), tmpObj.backDistBucket);
			tobj.endPos = new THREE.Vector3(startXA, tmpObj.offenseHeight * (tmpObj.abdomenHeight / tmpObj.idealHumanHeadHeights ), 0);
			tobj.strtTime = parseInt(strtTimeA + split2 + split2);
			tobj.endTime = parseInt(tobj.strtTime + tmpObj.flightTimeKick);
			this.enableStart(tmpObj, tobj);
			this.randRotateFar(tmpObj, randx, tobj.strtPos);
			this.randRotateClose(tmpObj, randx, tobj.endPos);
			this.postAdjustEndpos(tmpObj, tobj.endPos);

			strtTimeA = tobj.endTime;
		}
		
		return( strtTimeA );
	}  // initSegment


    // Initializes an instance of the strategy.
	init(tmpObj, strtTimeI) {

		const split2 = tmpObj.referenceTimeSplit;
		const randx = Math.random();

		var strtTimeA = strtTimeI;


		// Potentially modifies to a jumping kick.
		if (Math.random() < 0.25) {
			const tobj = tmpObj.jumpHurdlesA[0];
			tobj.strtPos = new THREE.Vector3(0.0, tmpObj.jumpHurdleHeight, tmpObj.backDistBucket);
			tobj.endPos = new THREE.Vector3(0.0, tmpObj.jumpHurdleHeight, 0);
			tobj.strtTime = strtTimeA;
			tobj.endTime = parseInt(tobj.strtTime + tmpObj.flightTimeKick);
			this.enableStart(tmpObj, tobj);
			this.randRotateFar(tmpObj, randx, tobj.strtPos);
			this.randRotateClose(tmpObj, randx, tobj.endPos);
			this.postAdjustEndpos(tmpObj, tobj.endPos);
			strtTimeA = strtTimeA + tmpObj.jumpingKickDelay;
		}


		


		const stime = this.initSegment(tmpObj, strtTimeA, randx, 0);
		strtTimeA = parseInt(stime + this.xDeltaTime( tmpObj.flightTimeKick ));


		tmpObj.endTime = strtTimeA;
		tmpObj.dumbbellStrategy.initPotentialDisruptiveDumbbell(tmpObj, strtTimeI, tmpObj.endTime);

	} // init


} // RightFrontKickAbdomenStrategy







// Strategy for a front-ball kick to the abdomen from the left.  The targets show the target of the kick only.
class LeftFrontKickAbdomenStrategy extends Strategy {



    // Initializes an instance of a segment of the strategy.
	initSegment(tmpObj, strtTimeI, randx, kickIndex) {

		const split2 = tmpObj.referenceTimeSplit;

		var strtTimeA = strtTimeI;


		{
			const startXA = -0.16;
			const tobj = tmpObj.targetsKickB[ parseInt( kickIndex+0) ];
			tobj.strtPos = new THREE.Vector3(startXA, tmpObj.offenseHeight * (tmpObj.abdomenHeight / tmpObj.idealHumanHeadHeights ), tmpObj.backDistBucket);
			tobj.endPos = new THREE.Vector3(startXA, tmpObj.offenseHeight * (tmpObj.abdomenHeight / tmpObj.idealHumanHeadHeights ), 0);
			tobj.strtTime = strtTimeA;
			tobj.endTime = parseInt(tobj.strtTime + tmpObj.flightTimeKick);
			this.enableStart(tmpObj, tobj);
			this.randRotateFar(tmpObj, randx, tobj.strtPos);
			this.randRotateClose(tmpObj, randx, tobj.endPos);
			this.postAdjustEndpos(tmpObj, tobj.endPos);
		}

		{
			const startXA = -0.16;
			const tobj = tmpObj.targetsKickB[ parseInt( kickIndex+1) ];
			tobj.strtPos = new THREE.Vector3(startXA, tmpObj.offenseHeight * (tmpObj.abdomenHeight / tmpObj.idealHumanHeadHeights ), tmpObj.backDistBucket);
			tobj.endPos = new THREE.Vector3(startXA, tmpObj.offenseHeight * (tmpObj.abdomenHeight / tmpObj.idealHumanHeadHeights ), 0);
			tobj.strtTime = parseInt(strtTimeA + split2);
			tobj.endTime = parseInt(tobj.strtTime + tmpObj.flightTimeKick);
			this.enableStart(tmpObj, tobj);
			this.randRotateFar(tmpObj, randx, tobj.strtPos);
			this.randRotateClose(tmpObj, randx, tobj.endPos);
			this.postAdjustEndpos(tmpObj, tobj.endPos);
		}

		{
			const startXA = -0.16;
			const tobj = tmpObj.targetsKickB[ parseInt( kickIndex+2) ];
			tobj.strtPos = new THREE.Vector3(startXA, tmpObj.offenseHeight * (tmpObj.abdomenHeight / tmpObj.idealHumanHeadHeights ), tmpObj.backDistBucket);
			tobj.endPos = new THREE.Vector3(startXA, tmpObj.offenseHeight * (tmpObj.abdomenHeight / tmpObj.idealHumanHeadHeights ), 0);
			tobj.strtTime = parseInt(strtTimeA + split2 + split2);
			tobj.endTime = parseInt(tobj.strtTime + tmpObj.flightTimeKick);
			this.enableStart(tmpObj, tobj);
			this.randRotateFar(tmpObj, randx, tobj.strtPos);
			this.randRotateClose(tmpObj, randx, tobj.endPos);
			this.postAdjustEndpos(tmpObj, tobj.endPos);

			strtTimeA = tobj.endTime;
		}
		
		return( strtTimeA );
	}  // initSegment


    // Initializes an instance of the strategy.
	init(tmpObj, strtTimeI) {

		const split2 = tmpObj.referenceTimeSplit;
		const randx = Math.random();

		var strtTimeA = strtTimeI;


		// Potentially modifies to a jumping kick.
		if (Math.random() < 0.25) {
			const tobj = tmpObj.jumpHurdlesA[0];
			tobj.strtPos = new THREE.Vector3(0.0, tmpObj.jumpHurdleHeight, tmpObj.backDistBucket);
			tobj.endPos = new THREE.Vector3(0.0, tmpObj.jumpHurdleHeight, 0);
			tobj.strtTime = strtTimeA;
			tobj.endTime = parseInt(tobj.strtTime + tmpObj.flightTimeKick);
			this.enableStart(tmpObj, tobj);
			this.randRotateFar(tmpObj, randx, tobj.strtPos);
			this.randRotateClose(tmpObj, randx, tobj.endPos);
			this.postAdjustEndpos(tmpObj, tobj.endPos);
			strtTimeA = strtTimeA + tmpObj.jumpingKickDelay;
		}


		


		const stime = this.initSegment(tmpObj, strtTimeA, randx, 0);
		strtTimeA = parseInt(stime + this.xDeltaTime( tmpObj.flightTimeKick ));


		tmpObj.endTime = strtTimeA;
		tmpObj.dumbbellStrategy.initPotentialDisruptiveDumbbell(tmpObj, strtTimeI, tmpObj.endTime);

	} // init
	

} // LeftFrontKickAbdomenStrategy






// Strategy for a right side-blade kick to the abdomen.
class RightSideBladeKickAbdomenStrategy extends Strategy {



    // Initializes an instance of a segment of the strategy.
	initSegment(tmpObj, strtTimeI, tdelay, cameraPos, kickIndex) {
	
	    var strtTimeA = strtTimeI;
	    const split2 = tmpObj.referenceTimeSplit;
	
	                 // *************************************************

		// ----------------------------------------


		{
			const tobj = tmpObj.targetsKickA[ parseInt(kickIndex+0) ];
			tobj.strtPos = new THREE.Vector3(Math.abs(tmpObj.backDistBucket), tmpObj.offenseHeight * (tmpObj.abdomenHeight / tmpObj.idealHumanHeadHeights ), cameraPos.z);
			tobj.endPos = new THREE.Vector3(cameraPos.x, tmpObj.offenseHeight * (tmpObj.abdomenHeight / tmpObj.idealHumanHeadHeights ), cameraPos.z);
			tobj.strtTime = parseInt(strtTimeA + tdelay);
			tobj.endTime = parseInt(tobj.strtTime + tmpObj.flightTimeKick);
			this.enableStart(tmpObj, tobj);
		}


		{
			const tobj = tmpObj.targetsKickA[ parseInt(kickIndex+1) ];
			tobj.strtPos = new THREE.Vector3(tmpObj.bucketXOffset, tmpObj.offenseHeight * (tmpObj.abdomenHeight / tmpObj.idealHumanHeadHeights ), tmpObj.backDistBucket);
			tobj.endPos = new THREE.Vector3(Math.abs(tmpObj.backDistBucket), tmpObj.offenseHeight * (tmpObj.abdomenHeight / tmpObj.idealHumanHeadHeights ), cameraPos.z);
			tobj.strtTime = strtTimeA;
			tobj.endTime = parseInt(tobj.strtTime + tmpObj.flightTimeKick);
			this.enableStart(tmpObj, tobj);
		}

		// ---------------------------------------------------------------------------



		{
			const tobj = tmpObj.targetsKickA[ parseInt(kickIndex+2) ];
			tobj.strtPos = new THREE.Vector3(Math.abs(tmpObj.backDistBucket), tmpObj.offenseHeight * (tmpObj.abdomenHeight / tmpObj.idealHumanHeadHeights ), cameraPos.z);
			tobj.endPos = new THREE.Vector3(cameraPos.x, tmpObj.offenseHeight * (tmpObj.abdomenHeight / tmpObj.idealHumanHeadHeights ), cameraPos.z);
			tobj.strtTime = parseInt(strtTimeA + split2 + tdelay);
			tobj.endTime = parseInt(tobj.strtTime + tmpObj.flightTimeKick);
			this.enableStart(tmpObj, tobj);
		}



		{
			const tobj = tmpObj.targetsKickA[ parseInt(kickIndex+3) ];
			tobj.strtPos = new THREE.Vector3(tmpObj.bucketXOffset, tmpObj.offenseHeight * (tmpObj.abdomenHeight / tmpObj.idealHumanHeadHeights ), tmpObj.backDistBucket);
			tobj.endPos = new THREE.Vector3(Math.abs(tmpObj.backDistBucket), tmpObj.offenseHeight * (tmpObj.abdomenHeight / tmpObj.idealHumanHeadHeights ), cameraPos.z);
			tobj.strtTime = parseInt(strtTimeA + split2);
			tobj.endTime = parseInt(tobj.strtTime + tmpObj.flightTimeKick);
			this.enableStart(tmpObj, tobj);
		}

		// ---------------------------------------------------------------------------



		{
			const tobj = tmpObj.targetsKickA[ parseInt(kickIndex+4) ];
			tobj.strtPos = new THREE.Vector3(Math.abs(tmpObj.backDistBucket), tmpObj.offenseHeight * (tmpObj.abdomenHeight / tmpObj.idealHumanHeadHeights ), cameraPos.z);
			tobj.endPos = new THREE.Vector3(cameraPos.x, tmpObj.offenseHeight * (tmpObj.abdomenHeight / tmpObj.idealHumanHeadHeights ), cameraPos.z);
			tobj.strtTime = parseInt(strtTimeA + split2 + split2 + tdelay);
			tobj.endTime = parseInt(tobj.strtTime + tmpObj.flightTimeKick);
			this.enableStart(tmpObj, tobj);
		}



		{
			const tobj = tmpObj.targetsKickA[ parseInt(kickIndex+5) ];
			tobj.strtPos = new THREE.Vector3(tmpObj.bucketXOffset, tmpObj.offenseHeight * (tmpObj.abdomenHeight / tmpObj.idealHumanHeadHeights ), tmpObj.backDistBucket);
			tobj.endPos = new THREE.Vector3(Math.abs(tmpObj.backDistBucket), tmpObj.offenseHeight * (tmpObj.abdomenHeight / tmpObj.idealHumanHeadHeights ), cameraPos.z);
			tobj.strtTime = parseInt(strtTimeA + split2 + split2);
			tobj.endTime = parseInt(tobj.strtTime + tmpObj.flightTimeKick);
			this.enableStart(tmpObj, tobj);
			strtTimeA = tobj.strtTime;
		}
		
		
		// ****************************************************
		
		return( strtTimeA );
		
	}  // initSegment


    // Initializes an instance of the strategy.
	init(tmpObj, strtTimeI) {

		const split2 = tmpObj.referenceTimeSplit;
		const cameraPos = new THREE.Vector3();
		tmpObj.realCamera.getWorldPosition(cameraPos);
		const tdelay = parseInt(2 * split2);

		var strtTimeA = strtTimeI;

		const jumping = Math.random() < 0.25;

		// Potentially modifies to a jumping kick.
		if (jumping) {
			const tobj = tmpObj.jumpHurdlesA[0];
			tobj.strtPos = new THREE.Vector3(Math.abs(tmpObj.backDistBucket), tmpObj.jumpHurdleHeight, cameraPos.z);
			tobj.endPos = new THREE.Vector3(cameraPos.x, tmpObj.jumpHurdleHeight, cameraPos.z);
			tobj.strtTime = parseInt(strtTimeA + tdelay);
			tobj.endTime = parseInt(tobj.strtTime + tmpObj.flightTimeKick);
			this.enableStart(tmpObj, tobj);
		}

		if (jumping) {
			const tobj = tmpObj.jumpHurdlesA[2];
			tobj.strtPos = new THREE.Vector3(tmpObj.bucketXOffset, tmpObj.jumpHurdleHeight, tmpObj.backDistBucket);
			tobj.endPos = new THREE.Vector3(cameraPos.x, tmpObj.jumpHurdleHeight, cameraPos.z);
			tobj.strtTime = parseInt(strtTimeA);
			tobj.endTime = parseInt(tobj.strtTime + tdelay + tmpObj.flightTimeKick);
			this.enableStart(tmpObj, tobj);
		}

		if (jumping) {
			const tobj = tmpObj.jumpHurdlesA[1];
			tobj.strtPos = new THREE.Vector3(tmpObj.bucketXOffset, tmpObj.jumpHurdleHeight, tmpObj.backDistBucket);
			tobj.endPos = new THREE.Vector3(Math.abs(tmpObj.backDistBucket), tmpObj.jumpHurdleHeight, cameraPos.z);
			tobj.strtTime = strtTimeA;
			tobj.endTime = parseInt(tobj.strtTime + tmpObj.flightTimeKick);
			this.enableStart(tmpObj, tobj);
			strtTimeA = strtTimeA + tmpObj.jumpingKickDelay;
		}

		// ----------------------------------------


		strtTimeA = this.initSegment(tmpObj, strtTimeA, tdelay, cameraPos, 0);
		strtTimeA = strtTimeA + tdelay + tmpObj.flightTimeKick + this.xDeltaTime( tmpObj.flightTimeKick );


		tmpObj.endTime = strtTimeA;
		tmpObj.dumbbellStrategy.initPotentialDisruptiveDumbbell(tmpObj, strtTimeI, tmpObj.endTime);

	} // init


} // RightSideBladeKickAbdomenStrategy






// Strategy for a left side-blade kick to the abdomen.
class LeftSideBladeKickAbdomenStrategy extends Strategy {



    // Initializes an instance of a segment of the strategy.
	initSegment(tmpObj, strtTimeI, tdelay, cameraPos, kickIndex) {
	
	    var strtTimeA = strtTimeI;
	    const split2 = tmpObj.referenceTimeSplit;
	
                // *****************************************************
                
		// ----------------------------------------


		{
			const tobj = tmpObj.targetsKickB[ parseInt(kickIndex+0) ];
			tobj.strtPos = new THREE.Vector3(-Math.abs(tmpObj.backDistBucket), tmpObj.offenseHeight * (tmpObj.abdomenHeight / tmpObj.idealHumanHeadHeights ), cameraPos.z);
			tobj.endPos = new THREE.Vector3(cameraPos.x, tmpObj.offenseHeight * (tmpObj.abdomenHeight / tmpObj.idealHumanHeadHeights ), cameraPos.z);
			tobj.strtTime = parseInt(strtTimeA + tdelay);
			tobj.endTime = parseInt(tobj.strtTime + tmpObj.flightTimeKick);
			this.enableStart(tmpObj, tobj);
		}


		{
			const tobj = tmpObj.targetsKickB[ parseInt(kickIndex+1) ];
			tobj.strtPos = new THREE.Vector3(-tmpObj.bucketXOffset, tmpObj.offenseHeight * (tmpObj.abdomenHeight / tmpObj.idealHumanHeadHeights ), tmpObj.backDistBucket);
			tobj.endPos = new THREE.Vector3(-Math.abs(tmpObj.backDistBucket), tmpObj.offenseHeight * (tmpObj.abdomenHeight / tmpObj.idealHumanHeadHeights ), cameraPos.z);
			tobj.strtTime = strtTimeA;
			tobj.endTime = parseInt(tobj.strtTime + tmpObj.flightTimeKick);
			this.enableStart(tmpObj, tobj);
		}

		// ---------------------------------------------------------------------------



		{
			const tobj = tmpObj.targetsKickB[ parseInt(kickIndex+2) ];
			tobj.strtPos = new THREE.Vector3(-Math.abs(tmpObj.backDistBucket), tmpObj.offenseHeight * (tmpObj.abdomenHeight / tmpObj.idealHumanHeadHeights ), cameraPos.z);
			tobj.endPos = new THREE.Vector3(cameraPos.x, tmpObj.offenseHeight * (tmpObj.abdomenHeight / tmpObj.idealHumanHeadHeights ), cameraPos.z);
			tobj.strtTime = parseInt(strtTimeA + split2 + tdelay);
			tobj.endTime = parseInt(tobj.strtTime + tmpObj.flightTimeKick);
			this.enableStart(tmpObj, tobj);
		}



		{
			const tobj = tmpObj.targetsKickB[ parseInt(kickIndex+3) ];
			tobj.strtPos = new THREE.Vector3(-tmpObj.bucketXOffset, tmpObj.offenseHeight * (tmpObj.abdomenHeight / tmpObj.idealHumanHeadHeights ), tmpObj.backDistBucket);
			tobj.endPos = new THREE.Vector3(-Math.abs(tmpObj.backDistBucket), tmpObj.offenseHeight * (tmpObj.abdomenHeight / tmpObj.idealHumanHeadHeights ), cameraPos.z);
			tobj.strtTime = parseInt(strtTimeA + split2);
			tobj.endTime = parseInt(tobj.strtTime + tmpObj.flightTimeKick);
			this.enableStart(tmpObj, tobj);
		}

		// ---------------------------------------------------------------------------


		{
			const tobj = tmpObj.targetsKickB[ parseInt(kickIndex+4) ];
			tobj.strtPos = new THREE.Vector3(-Math.abs(tmpObj.backDistBucket), tmpObj.offenseHeight * (tmpObj.abdomenHeight / tmpObj.idealHumanHeadHeights ), cameraPos.z);
			tobj.endPos = new THREE.Vector3(cameraPos.x, tmpObj.offenseHeight * (tmpObj.abdomenHeight / tmpObj.idealHumanHeadHeights ), cameraPos.z);
			tobj.strtTime = parseInt(strtTimeA + split2 + split2 + tdelay);
			tobj.endTime = parseInt(tobj.strtTime + tmpObj.flightTimeKick);
			this.enableStart(tmpObj, tobj);
		}



		{
			const tobj = tmpObj.targetsKickB[ parseInt(kickIndex+5) ];
			tobj.strtPos = new THREE.Vector3(-tmpObj.bucketXOffset, tmpObj.offenseHeight * (tmpObj.abdomenHeight / tmpObj.idealHumanHeadHeights ), tmpObj.backDistBucket);
			tobj.endPos = new THREE.Vector3(-Math.abs(tmpObj.backDistBucket), tmpObj.offenseHeight * (tmpObj.abdomenHeight / tmpObj.idealHumanHeadHeights ), cameraPos.z);
			tobj.strtTime = parseInt(strtTimeA + split2 + split2);
			tobj.endTime = parseInt(tobj.strtTime + tmpObj.flightTimeKick);
			this.enableStart(tmpObj, tobj);
			strtTimeA = tobj.strtTime;
		}
		
		
		// **************************************************************************	
	
	    return( strtTimeA );
	
	}  // initSegment


    // Initializes an instance of the strategy.
	init(tmpObj, strtTimeI) {

		const split2 = tmpObj.referenceTimeSplit;
		const cameraPos = new THREE.Vector3();
		tmpObj.realCamera.getWorldPosition(cameraPos);
		const tdelay = parseInt(2 * split2);

		var strtTimeA = strtTimeI;

		const jumping = Math.random() < 0.25;

		// Potentially modifies to a jumping kick.
		if (jumping) {
			const tobj = tmpObj.jumpHurdlesA[0];
			tobj.strtPos = new THREE.Vector3(-Math.abs(tmpObj.backDistBucket), tmpObj.jumpHurdleHeight, cameraPos.z);
			tobj.endPos = new THREE.Vector3(cameraPos.x, tmpObj.jumpHurdleHeight, cameraPos.z);
			tobj.strtTime = parseInt(strtTimeA + tdelay);
			tobj.endTime = parseInt(tobj.strtTime + tmpObj.flightTimeKick);
			this.enableStart(tmpObj, tobj);
		}

		if (jumping) {
			const tobj = tmpObj.jumpHurdlesA[2];
			tobj.strtPos = new THREE.Vector3(-tmpObj.bucketXOffset, tmpObj.jumpHurdleHeight, tmpObj.backDistBucket);
			tobj.endPos = new THREE.Vector3(cameraPos.x, tmpObj.jumpHurdleHeight, cameraPos.z);
			tobj.strtTime = parseInt(strtTimeA);
			tobj.endTime = parseInt(tobj.strtTime + tdelay + tmpObj.flightTimeKick);
			this.enableStart(tmpObj, tobj);
		}

		if (jumping) {
			const tobj = tmpObj.jumpHurdlesA[1];
			tobj.strtPos = new THREE.Vector3(-tmpObj.bucketXOffset, tmpObj.jumpHurdleHeight, tmpObj.backDistBucket);
			tobj.endPos = new THREE.Vector3(-Math.abs(tmpObj.backDistBucket), tmpObj.jumpHurdleHeight, cameraPos.z);
			tobj.strtTime = strtTimeA;
			tobj.endTime = parseInt(tobj.strtTime + tmpObj.flightTimeKick );
			this.enableStart(tmpObj, tobj);
			strtTimeA = strtTimeA + tmpObj.jumpingKickDelay;
		}

		// ----------------------------------------


		strtTimeA = this.initSegment(tmpObj, strtTimeA, tdelay, cameraPos, 0);
		strtTimeA = strtTimeA + tdelay + tmpObj.flightTimeKick + this.xDeltaTime( tmpObj.flightTimeKick );


		tmpObj.endTime = strtTimeA;
		tmpObj.dumbbellStrategy.initPotentialDisruptiveDumbbell(tmpObj, strtTimeI, tmpObj.endTime);

	} // init
	

} // LeftSideBladeKickAbdomenStrategy






// Strategy for a train of right side-blade kicks to the abdomen.
class RightSideBladeKickTrainAbdomenStrategy extends Strategy {


    // Initializes an instance of the strategy.
	init(tmpObj, strtTimeI) {

		const split2 = tmpObj.referenceTimeSplit;
		const cameraPos = new THREE.Vector3();
		tmpObj.realCamera.getWorldPosition(cameraPos);
		const tdelay = parseInt(2 * split2);

		var strtTimeA = strtTimeI;

		const jumping = Math.random() < 0.25;

		// Potentially modifies to a jumping kick.
		if (jumping) {
			const tobj = tmpObj.jumpHurdlesA[0];
			tobj.strtPos = new THREE.Vector3(Math.abs(tmpObj.backDistBucket), tmpObj.jumpHurdleHeight, cameraPos.z);
			tobj.endPos = new THREE.Vector3(cameraPos.x, tmpObj.jumpHurdleHeight, cameraPos.z);
			tobj.strtTime = parseInt(strtTimeA + tdelay);
			tobj.endTime = parseInt(tobj.strtTime + tmpObj.flightTimeKick);
			this.enableStart(tmpObj, tobj);
		}

		if (jumping) {
			const tobj = tmpObj.jumpHurdlesA[2];
			tobj.strtPos = new THREE.Vector3(tmpObj.bucketXOffset, tmpObj.jumpHurdleHeight, tmpObj.backDistBucket);
			tobj.endPos = new THREE.Vector3(cameraPos.x, tmpObj.jumpHurdleHeight, cameraPos.z);
			tobj.strtTime = parseInt(strtTimeA);
			tobj.endTime = parseInt(tobj.strtTime + tdelay + tmpObj.flightTimeKick);
			this.enableStart(tmpObj, tobj);
		}

		if (jumping) {
			const tobj = tmpObj.jumpHurdlesA[1];
			tobj.strtPos = new THREE.Vector3(tmpObj.bucketXOffset, tmpObj.jumpHurdleHeight, tmpObj.backDistBucket);
			tobj.endPos = new THREE.Vector3(Math.abs(tmpObj.backDistBucket), tmpObj.jumpHurdleHeight, cameraPos.z);
			tobj.strtTime = strtTimeA;
			tobj.endTime = parseInt(tobj.strtTime + tmpObj.flightTimeKick);
			this.enableStart(tmpObj, tobj);
			strtTimeA = strtTimeA + tmpObj.jumpingKickDelay;
		}



        strtTimeA = tmpObj.rightSideBladeKickAbdomenStrategy.initSegment(tmpObj, strtTimeA, tdelay, cameraPos, 0);
        strtTimeA = strtTimeA + /* 0.5 * */ 3.0 * ( tmpObj.jumpingKickDelay );
        
        
        if(  Math.random() > 0.5 )
        {
        	strtTimeA = tmpObj.rightSideBladeKickAbdomenStrategy.initSegment(tmpObj, strtTimeA, tdelay, cameraPos, 6);
            strtTimeA = strtTimeA + /* 0.5 * */ 3.0 * ( tmpObj.jumpingKickDelay );
        }


                 // *************************************************

		// ----------------------------------------


		strtTimeA = tmpObj.rightSideBladeKickAbdomenStrategy.initSegment(tmpObj, strtTimeA, tdelay, cameraPos, 12);
		strtTimeA = strtTimeA + tdelay + tmpObj.flightTimeKick;
		
		
		// ****************************************************


                strtTimeA = parseInt( strtTimeA + this.xDeltaTime( tmpObj.flightTimeKick ) );


		tmpObj.endTime = strtTimeA;
		tmpObj.dumbbellStrategy.initPotentialDisruptiveDumbbell(tmpObj, strtTimeI, tmpObj.endTime);

	} // init
	

} // RightSideBladeKickTrainAbdomenStrategy






// Strategy for a train of left side-blade kicks to the abdomen.
class LeftSideBladeKickTrainAbdomenStrategy extends Strategy {


    // Initializes an instance of the strategy.
	init(tmpObj, strtTimeI) {

		const split2 = tmpObj.referenceTimeSplit;
		const cameraPos = new THREE.Vector3();
		tmpObj.realCamera.getWorldPosition(cameraPos);
		const tdelay = parseInt(2 * split2);

		var strtTimeA = strtTimeI;

		const jumping = Math.random() < 0.25;

		// Potentially modifies to a jumping kick.
		if (jumping) {
			const tobj = tmpObj.jumpHurdlesA[0];
			tobj.strtPos = new THREE.Vector3(-Math.abs(tmpObj.backDistBucket), tmpObj.jumpHurdleHeight, cameraPos.z);
			tobj.endPos = new THREE.Vector3(cameraPos.x, tmpObj.jumpHurdleHeight, cameraPos.z);
			tobj.strtTime = parseInt(strtTimeA + tdelay);
			tobj.endTime = parseInt(tobj.strtTime + tmpObj.flightTimeKick);
			this.enableStart(tmpObj, tobj);
		}

		if (jumping) {
			const tobj = tmpObj.jumpHurdlesA[2];
			tobj.strtPos = new THREE.Vector3(-tmpObj.bucketXOffset, tmpObj.jumpHurdleHeight, tmpObj.backDistBucket);
			tobj.endPos = new THREE.Vector3(cameraPos.x, tmpObj.jumpHurdleHeight, cameraPos.z);
			tobj.strtTime = parseInt(strtTimeA);
			tobj.endTime = parseInt(tobj.strtTime + tdelay + tmpObj.flightTimeKick);
			this.enableStart(tmpObj, tobj);
		}

		if (jumping) {
			const tobj = tmpObj.jumpHurdlesA[1];
			tobj.strtPos = new THREE.Vector3(-tmpObj.bucketXOffset, tmpObj.jumpHurdleHeight, tmpObj.backDistBucket);
			tobj.endPos = new THREE.Vector3(-Math.abs(tmpObj.backDistBucket), tmpObj.jumpHurdleHeight, cameraPos.z);
			tobj.strtTime = strtTimeA;
			tobj.endTime = parseInt(tobj.strtTime + tmpObj.flightTimeKick);
			this.enableStart(tmpObj, tobj);
			strtTimeA = strtTimeA + tmpObj.jumpingKickDelay;
		}



        strtTimeA = tmpObj.leftSideBladeKickAbdomenStrategy.initSegment(tmpObj, strtTimeA, tdelay, cameraPos, 0);
        strtTimeA = strtTimeA + /* 0.5 * */ 3.0 * ( tmpObj.jumpingKickDelay );
        
        
        if(  Math.random() > 0.5 )
        {
        	strtTimeA = tmpObj.leftSideBladeKickAbdomenStrategy.initSegment(tmpObj, strtTimeA, tdelay, cameraPos, 6);
            strtTimeA = strtTimeA + /* 0.5 * */ 3.0 * ( tmpObj.jumpingKickDelay );
        }


                // *****************************************************
                
		// ----------------------------------------


		strtTimeA = tmpObj.leftSideBladeKickAbdomenStrategy.initSegment(tmpObj, strtTimeA, tdelay, cameraPos, 12);
		strtTimeA = strtTimeA + tdelay + tmpObj.flightTimeKick;
		
		
		// **************************************************************************


                strtTimeA = parseInt( strtTimeA + this.xDeltaTime( tmpObj.flightTimeKick ) );


		tmpObj.endTime = strtTimeA;
		tmpObj.dumbbellStrategy.initPotentialDisruptiveDumbbell(tmpObj, strtTimeI, tmpObj.endTime);

	} // init


} // LeftSideBladeKickTrainAbdomenStrategy






// Strategy for a right side-blade kick to the leg.
class RightSideBladeKickLegStrategy extends Strategy {

    // Initializes an instance of the strategy.
	init(tmpObj, strtTimeI) {

		const split2 = tmpObj.referenceTimeSplit;
		const cameraPos = new THREE.Vector3();
		tmpObj.realCamera.getWorldPosition(cameraPos);
		const tdelay = parseInt(2 * split2);

		var strtTimeA = strtTimeI;

		const jumping = Math.random() < 0.25;

		// Potentially modifies to a jumping kick.
		if (jumping) {
			const tobj = tmpObj.jumpHurdlesA[0];
			tobj.strtPos = new THREE.Vector3(Math.abs(tmpObj.backDistBucket), tmpObj.jumpHurdleHeight, cameraPos.z);
			tobj.endPos = new THREE.Vector3(cameraPos.x, tmpObj.jumpHurdleHeight, cameraPos.z);
			tobj.strtTime = parseInt(strtTimeA + tdelay);
			tobj.endTime = parseInt(tobj.strtTime + tmpObj.flightTimeKick);
			this.enableStart(tmpObj, tobj);
		}

		if (jumping) {
			const tobj = tmpObj.jumpHurdlesA[2];
			tobj.strtPos = new THREE.Vector3(tmpObj.bucketXOffset, tmpObj.jumpHurdleHeight, tmpObj.backDistBucket);
			tobj.endPos = new THREE.Vector3(cameraPos.x, tmpObj.jumpHurdleHeight, cameraPos.z);
			tobj.strtTime = parseInt(strtTimeA);
			tobj.endTime = parseInt(tobj.strtTime + tdelay + tmpObj.flightTimeKick);
			this.enableStart(tmpObj, tobj);
		}

		if (jumping) {
			const tobj = tmpObj.jumpHurdlesA[1];
			tobj.strtPos = new THREE.Vector3(tmpObj.bucketXOffset, tmpObj.jumpHurdleHeight, tmpObj.backDistBucket);
			tobj.endPos = new THREE.Vector3(Math.abs(tmpObj.backDistBucket), tmpObj.jumpHurdleHeight, cameraPos.z);
			tobj.strtTime = strtTimeA;
			tobj.endTime = parseInt(tobj.strtTime + tmpObj.flightTimeKick);
			this.enableStart(tmpObj, tobj);
			strtTimeA = strtTimeA + tmpObj.jumpingKickDelay;
		}

		// ----------------------------------------


		{
			const tobj = tmpObj.targetsKickA[0];
			tobj.strtPos = new THREE.Vector3(Math.abs(tmpObj.backDistBucket), tmpObj.offenseHeight * (tmpObj.legHeight / tmpObj.idealHumanHeadHeights ), cameraPos.z);
			tobj.endPos = new THREE.Vector3(cameraPos.x, tmpObj.offenseHeight * (tmpObj.legHeight / tmpObj.idealHumanHeadHeights ), cameraPos.z);
			tobj.strtTime = parseInt(strtTimeA + tdelay);
			tobj.endTime = parseInt(tobj.strtTime + tmpObj.flightTimeKick);
			this.enableStart(tmpObj, tobj);
		}


		{
			const tobj = tmpObj.targetsKickA[1];
			tobj.strtPos = new THREE.Vector3(tmpObj.bucketXOffset, tmpObj.offenseHeight * (tmpObj.legHeight / tmpObj.idealHumanHeadHeights ), tmpObj.backDistBucket);
			tobj.endPos = new THREE.Vector3(Math.abs(tmpObj.backDistBucket), tmpObj.offenseHeight * (tmpObj.legHeight / tmpObj.idealHumanHeadHeights ), cameraPos.z);
			tobj.strtTime = strtTimeA;
			tobj.endTime = parseInt(tobj.strtTime + tmpObj.flightTimeKick);
			this.enableStart(tmpObj, tobj);
		}

		// ---------------------------------------------------------------------------



		{
			const tobj = tmpObj.targetsKickA[2];
			tobj.strtPos = new THREE.Vector3(Math.abs(tmpObj.backDistBucket), tmpObj.offenseHeight * (tmpObj.legHeight / tmpObj.idealHumanHeadHeights ), cameraPos.z);
			tobj.endPos = new THREE.Vector3(cameraPos.x, tmpObj.offenseHeight * (tmpObj.legHeight / tmpObj.idealHumanHeadHeights ), cameraPos.z);
			tobj.strtTime = parseInt(strtTimeA + split2 + tdelay);
			tobj.endTime = parseInt(tobj.strtTime + tmpObj.flightTimeKick);
			this.enableStart(tmpObj, tobj);
		}



		{
			const tobj = tmpObj.targetsKickA[3];
			tobj.strtPos = new THREE.Vector3(tmpObj.bucketXOffset, tmpObj.offenseHeight * (tmpObj.legHeight / tmpObj.idealHumanHeadHeights ), tmpObj.backDistBucket);
			tobj.endPos = new THREE.Vector3(Math.abs(tmpObj.backDistBucket), tmpObj.offenseHeight * (tmpObj.legHeight / tmpObj.idealHumanHeadHeights ), cameraPos.z);
			tobj.strtTime = parseInt(strtTimeA + split2);
			tobj.endTime = parseInt(tobj.strtTime + tmpObj.flightTimeKick);
			this.enableStart(tmpObj, tobj);
		}

		// ---------------------------------------------------------------------------

		var nextTime = strtTimeA;


		{
			const tobj = tmpObj.targetsKickA[4];
			tobj.strtPos = new THREE.Vector3(Math.abs(tmpObj.backDistBucket), tmpObj.offenseHeight * (tmpObj.legHeight / tmpObj.idealHumanHeadHeights ), cameraPos.z);
			tobj.endPos = new THREE.Vector3(cameraPos.x, tmpObj.offenseHeight * (tmpObj.legHeight / tmpObj.idealHumanHeadHeights ), cameraPos.z);
			tobj.strtTime = parseInt(strtTimeA + split2 + split2 + tdelay);
			tobj.endTime = parseInt(tobj.strtTime + tmpObj.flightTimeKick);
			this.enableStart(tmpObj, tobj);

			nextTime = parseInt(tobj.endTime + this.xDeltaTime( tmpObj.flightTimeKick ));
		}



		{
			const tobj = tmpObj.targetsKickA[5];
			tobj.strtPos = new THREE.Vector3(tmpObj.bucketXOffset, tmpObj.offenseHeight * (tmpObj.legHeight / tmpObj.idealHumanHeadHeights ), tmpObj.backDistBucket);
			tobj.endPos = new THREE.Vector3(Math.abs(tmpObj.backDistBucket), tmpObj.offenseHeight * (tmpObj.legHeight / tmpObj.idealHumanHeadHeights ), cameraPos.z);
			tobj.strtTime = parseInt(strtTimeA + split2 + split2);
			tobj.endTime = parseInt(tobj.strtTime + tmpObj.flightTimeKick);
			this.enableStart(tmpObj, tobj);
		}


		strtTimeA = nextTime;


		tmpObj.endTime = strtTimeA;
		tmpObj.dumbbellStrategy.initPotentialDisruptiveDumbbell(tmpObj, strtTimeI, tmpObj.endTime);

	} // init
	

} // RightSideBladeKickLegStrategy






// Strategy for a left side-blade kick to the leg.
class LeftSideBladeKickLegStrategy extends Strategy {

    // Initializes an instance of the strategy.
	init(tmpObj, strtTimeI) {

		const split2 = tmpObj.referenceTimeSplit;
		const cameraPos = new THREE.Vector3();
		tmpObj.realCamera.getWorldPosition(cameraPos);
		const tdelay = parseInt(2 * split2);

		var strtTimeA = strtTimeI;

		const jumping = Math.random() < 0.25;

		// Potentially modifies to a jumping kick.
		if (jumping) {
			const tobj = tmpObj.jumpHurdlesA[0];
			tobj.strtPos = new THREE.Vector3(-Math.abs(tmpObj.backDistBucket), tmpObj.jumpHurdleHeight, cameraPos.z);
			tobj.endPos = new THREE.Vector3(cameraPos.x, tmpObj.jumpHurdleHeight, cameraPos.z);
			tobj.strtTime = parseInt(strtTimeA + tdelay);
			tobj.endTime = parseInt(tobj.strtTime + tmpObj.flightTimeKick);
			this.enableStart(tmpObj, tobj);
		}

		if (jumping) {
			const tobj = tmpObj.jumpHurdlesA[2];
			tobj.strtPos = new THREE.Vector3(-tmpObj.bucketXOffset, tmpObj.jumpHurdleHeight, tmpObj.backDistBucket);
			tobj.endPos = new THREE.Vector3(cameraPos.x, tmpObj.jumpHurdleHeight, cameraPos.z);
			tobj.strtTime = parseInt(strtTimeA);
			tobj.endTime = parseInt(tobj.strtTime + tdelay + tmpObj.flightTimeKick);
			this.enableStart(tmpObj, tobj);
		}

		if (jumping) {
			const tobj = tmpObj.jumpHurdlesA[1];
			tobj.strtPos = new THREE.Vector3(-tmpObj.bucketXOffset, tmpObj.jumpHurdleHeight, tmpObj.backDistBucket);
			tobj.endPos = new THREE.Vector3(-Math.abs(tmpObj.backDistBucket), tmpObj.jumpHurdleHeight, cameraPos.z);
			tobj.strtTime = strtTimeA;
			tobj.endTime = parseInt(tobj.strtTime + tmpObj.flightTimeKick);
			this.enableStart(tmpObj, tobj);
			strtTimeA = strtTimeA + tmpObj.jumpingKickDelay;
		}

		// ----------------------------------------


		{
			const tobj = tmpObj.targetsKickB[0];
			tobj.strtPos = new THREE.Vector3(-Math.abs(tmpObj.backDistBucket), tmpObj.offenseHeight * (tmpObj.legHeight / tmpObj.idealHumanHeadHeights ), cameraPos.z);
			tobj.endPos = new THREE.Vector3(cameraPos.x, tmpObj.offenseHeight * (tmpObj.legHeight / tmpObj.idealHumanHeadHeights ), cameraPos.z);
			tobj.strtTime = parseInt(strtTimeA + tdelay);
			tobj.endTime = parseInt(tobj.strtTime + tmpObj.flightTimeKick);
			this.enableStart(tmpObj, tobj);
		}


		{
			const tobj = tmpObj.targetsKickB[1];
			tobj.strtPos = new THREE.Vector3(-tmpObj.bucketXOffset, tmpObj.offenseHeight * (tmpObj.legHeight / tmpObj.idealHumanHeadHeights ), tmpObj.backDistBucket);
			tobj.endPos = new THREE.Vector3(-Math.abs(tmpObj.backDistBucket), tmpObj.offenseHeight * (tmpObj.legHeight / tmpObj.idealHumanHeadHeights ), cameraPos.z);
			tobj.strtTime = strtTimeA;
			tobj.endTime = parseInt(tobj.strtTime + tmpObj.flightTimeKick);
			this.enableStart(tmpObj, tobj);
		}

		// ---------------------------------------------------------------------------



		{
			const tobj = tmpObj.targetsKickB[2];
			tobj.strtPos = new THREE.Vector3(-Math.abs(tmpObj.backDistBucket), tmpObj.offenseHeight * (tmpObj.legHeight / tmpObj.idealHumanHeadHeights ), cameraPos.z);
			tobj.endPos = new THREE.Vector3(cameraPos.x, tmpObj.offenseHeight * (tmpObj.legHeight / tmpObj.idealHumanHeadHeights ), cameraPos.z);
			tobj.strtTime = parseInt(strtTimeA + split2 + tdelay);
			tobj.endTime = parseInt(tobj.strtTime + tmpObj.flightTimeKick);
			this.enableStart(tmpObj, tobj);
		}



		{
			const tobj = tmpObj.targetsKickB[3];
			tobj.strtPos = new THREE.Vector3(-tmpObj.bucketXOffset, tmpObj.offenseHeight * (tmpObj.legHeight / tmpObj.idealHumanHeadHeights ), tmpObj.backDistBucket);
			tobj.endPos = new THREE.Vector3(-Math.abs(tmpObj.backDistBucket), tmpObj.offenseHeight * (tmpObj.legHeight / tmpObj.idealHumanHeadHeights ), cameraPos.z);
			tobj.strtTime = parseInt(strtTimeA + split2);
			tobj.endTime = parseInt(tobj.strtTime + tmpObj.flightTimeKick);
			this.enableStart(tmpObj, tobj);
		}

		// ---------------------------------------------------------------------------

		var nextTime = strtTimeA;



		{
			const tobj = tmpObj.targetsKickB[4];
			tobj.strtPos = new THREE.Vector3(-Math.abs(tmpObj.backDistBucket), tmpObj.offenseHeight * (tmpObj.legHeight / tmpObj.idealHumanHeadHeights ), cameraPos.z);
			tobj.endPos = new THREE.Vector3(cameraPos.x, tmpObj.offenseHeight * (tmpObj.legHeight / tmpObj.idealHumanHeadHeights ), cameraPos.z);
			tobj.strtTime = parseInt(strtTimeA + split2 + split2 + tdelay);
			tobj.endTime = parseInt(tobj.strtTime + tmpObj.flightTimeKick);
			this.enableStart(tmpObj, tobj);

			nextTime = parseInt(tobj.endTime + this.xDeltaTime( tmpObj.flightTimeKick ));
		}



		{
			const tobj = tmpObj.targetsKickB[5];
			tobj.strtPos = new THREE.Vector3(-tmpObj.bucketXOffset, tmpObj.offenseHeight * (tmpObj.legHeight / tmpObj.idealHumanHeadHeights ), tmpObj.backDistBucket);
			tobj.endPos = new THREE.Vector3(-Math.abs(tmpObj.backDistBucket), tmpObj.offenseHeight * (tmpObj.legHeight / tmpObj.idealHumanHeadHeights ), cameraPos.z);
			tobj.strtTime = parseInt(strtTimeA + split2 + split2);
			tobj.endTime = parseInt(tobj.strtTime + tmpObj.flightTimeKick);
			this.enableStart(tmpObj, tobj);
		}


		strtTimeA = nextTime;


		tmpObj.endTime = strtTimeA;
		tmpObj.dumbbellStrategy.initPotentialDisruptiveDumbbell(tmpObj, strtTimeI, tmpObj.endTime);

	} // init
	

} // LeftSideBladeKickLegStrategy






// Strategy for a right roundhouse kick.
class RightRoundhouseKickStrategy extends Strategy {



    // Initializes an instance of a segment of the strategy.
	initSegment(tmpObj, strtTimeI, randx, kickIndex) {

		const split2 = tmpObj.referenceTimeSplit;

		var strtTimeA = strtTimeI;


		{
			const startXA = 0.16;
			const tobj = tmpObj.targetsKickA[ parseInt( kickIndex+0 ) ];
			tobj.strtPos = new THREE.Vector3(startXA, tmpObj.offenseHeight * (tmpObj.abdomenHeight / tmpObj.idealHumanHeadHeights ), tmpObj.backDistBucket);
			tobj.endPos = new THREE.Vector3(startXA, tmpObj.offenseHeight * (tmpObj.abdomenHeight / tmpObj.idealHumanHeadHeights ), 0);
			tobj.strtTime = strtTimeA;
			tobj.endTime = parseInt(tobj.strtTime + tmpObj.flightTimeKick);
			this.enableStart(tmpObj, tobj);
			this.randRotateFar(tmpObj, randx, tobj.strtPos);
			this.randRotateClose(tmpObj, randx, tobj.endPos);
			this.postAdjustEndpos(tmpObj, tobj.endPos);
		}

		{
			const startXA = 0.0;
			const tobj = tmpObj.targetsKickA[ parseInt( kickIndex+1 ) ];
			tobj.strtPos = new THREE.Vector3(startXA, tmpObj.offenseHeight * (tmpObj.abdomenHeight / tmpObj.idealHumanHeadHeights ), tmpObj.backDistBucket);
			tobj.endPos = new THREE.Vector3(startXA, tmpObj.offenseHeight * (tmpObj.abdomenHeight / tmpObj.idealHumanHeadHeights ), 0);
			tobj.strtTime = parseInt(strtTimeA + split2);
			tobj.endTime = parseInt(tobj.strtTime + tmpObj.flightTimeKick);
			this.enableStart(tmpObj, tobj);
			this.randRotateFar(tmpObj, randx, tobj.strtPos);
			this.randRotateClose(tmpObj, randx, tobj.endPos);
			this.postAdjustEndpos(tmpObj, tobj.endPos);
		}

		{
			const startXA = -0.16;
			const tobj = tmpObj.targetsKickA[ parseInt( kickIndex+2 ) ];
			tobj.strtPos = new THREE.Vector3(startXA, tmpObj.offenseHeight * (tmpObj.abdomenHeight / tmpObj.idealHumanHeadHeights ), tmpObj.backDistBucket);
			tobj.endPos = new THREE.Vector3(startXA, tmpObj.offenseHeight * (tmpObj.abdomenHeight / tmpObj.idealHumanHeadHeights ), 0);
			tobj.strtTime = parseInt(strtTimeA + split2 + split2);
			tobj.endTime = parseInt(tobj.strtTime + tmpObj.flightTimeKick);
			this.enableStart(tmpObj, tobj);
			this.randRotateFar(tmpObj, randx, tobj.strtPos);
			this.randRotateClose(tmpObj, randx, tobj.endPos);
			this.postAdjustEndpos(tmpObj, tobj.endPos);

			strtTimeA = tobj.endTime;
		}
		
		return( strtTimeA );
	
	}  // initSegment



    // Initializes an instance of the strategy.
	init(tmpObj, strtTimeI) {

		const split2 = tmpObj.referenceTimeSplit;
		const randx = Math.random();

		var strtTimeA = strtTimeI;


		// Potentially modifies to a jumping kick.
		if (Math.random() < 0.25) {
			const tobj = tmpObj.jumpHurdlesA[0];
			tobj.strtPos = new THREE.Vector3(0.0, tmpObj.jumpHurdleHeight, tmpObj.backDistBucket);
			tobj.endPos = new THREE.Vector3(0.0, tmpObj.jumpHurdleHeight, 0);
			tobj.strtTime = strtTimeA;
			tobj.endTime = parseInt(tobj.strtTime + tmpObj.flightTimeKick);
			this.enableStart(tmpObj, tobj);
			this.randRotateFar(tmpObj, randx, tobj.strtPos);
			this.randRotateClose(tmpObj, randx, tobj.endPos);
			this.postAdjustEndpos(tmpObj, tobj.endPos);
			strtTimeA = strtTimeA + tmpObj.jumpingKickDelay;
		}


		const stime = this.initSegment(tmpObj, strtTimeA, randx, 0);
		strtTimeA = parseInt(stime + this.xDeltaTime( tmpObj.flightTimeKick ));


		tmpObj.endTime = strtTimeA;
		tmpObj.dumbbellStrategy.initPotentialDisruptiveDumbbell(tmpObj, strtTimeI, tmpObj.endTime);

	}  // init
	

} // RightRoundhouseKickStrategy







// Strategy for a left roundhouse kick.
class LeftRoundhouseKickStrategy extends Strategy {



    // Initializes an instance of a segment of the strategy.
	initSegment(tmpObj, strtTimeI, randx, kickIndex) {

		const split2 = tmpObj.referenceTimeSplit;

		var strtTimeA = strtTimeI;


		{
			const startXA = -0.16;
			const tobj = tmpObj.targetsKickB[ parseInt( kickIndex+0 ) ];
			tobj.strtPos = new THREE.Vector3(startXA, tmpObj.offenseHeight * (tmpObj.abdomenHeight / tmpObj.idealHumanHeadHeights ), tmpObj.backDistBucket);
			tobj.endPos = new THREE.Vector3(startXA, tmpObj.offenseHeight * (tmpObj.abdomenHeight / tmpObj.idealHumanHeadHeights ), 0);
			tobj.strtTime = strtTimeA;
			tobj.endTime = parseInt(tobj.strtTime + tmpObj.flightTimeKick);
			this.enableStart(tmpObj, tobj);
			this.randRotateFar(tmpObj, randx, tobj.strtPos);
			this.randRotateClose(tmpObj, randx, tobj.endPos);
			this.postAdjustEndpos(tmpObj, tobj.endPos);
		}

		{
			const startXA = 0.0;
			const tobj = tmpObj.targetsKickB[ parseInt( kickIndex+1 ) ];
			tobj.strtPos = new THREE.Vector3(startXA, tmpObj.offenseHeight * (tmpObj.abdomenHeight / tmpObj.idealHumanHeadHeights ), tmpObj.backDistBucket);
			tobj.endPos = new THREE.Vector3(startXA, tmpObj.offenseHeight * (tmpObj.abdomenHeight / tmpObj.idealHumanHeadHeights ), 0);
			tobj.strtTime = parseInt(strtTimeA + split2);
			tobj.endTime = parseInt(tobj.strtTime + tmpObj.flightTimeKick);
			this.enableStart(tmpObj, tobj);
			this.randRotateFar(tmpObj, randx, tobj.strtPos);
			this.randRotateClose(tmpObj, randx, tobj.endPos);
			this.postAdjustEndpos(tmpObj, tobj.endPos);
		}

		{
			const startXA = 0.16;
			const tobj = tmpObj.targetsKickB[ parseInt( kickIndex+2 ) ];
			tobj.strtPos = new THREE.Vector3(startXA, tmpObj.offenseHeight * (tmpObj.abdomenHeight / tmpObj.idealHumanHeadHeights ), tmpObj.backDistBucket);
			tobj.endPos = new THREE.Vector3(startXA, tmpObj.offenseHeight * (tmpObj.abdomenHeight / tmpObj.idealHumanHeadHeights ), 0);
			tobj.strtTime = parseInt(strtTimeA + split2 + split2);
			tobj.endTime = parseInt(tobj.strtTime + tmpObj.flightTimeKick);
			this.enableStart(tmpObj, tobj);
			this.randRotateFar(tmpObj, randx, tobj.strtPos);
			this.randRotateClose(tmpObj, randx, tobj.endPos);
			this.postAdjustEndpos(tmpObj, tobj.endPos);

			strtTimeA = tobj.endTime;
		}
	
	    return( strtTimeA );
	}  // initSegment


    // Initializes an instance of the strategy.
	init(tmpObj, strtTimeI) {

		const split2 = tmpObj.referenceTimeSplit;
		const randx = Math.random();

		var strtTimeA = strtTimeI;


		// Potentially modifies to a jumping kick.
		if (Math.random() < 0.25) {
			const tobj = tmpObj.jumpHurdlesA[0];
			tobj.strtPos = new THREE.Vector3(0.0, tmpObj.jumpHurdleHeight, tmpObj.backDistBucket);
			tobj.endPos = new THREE.Vector3(0.0, tmpObj.jumpHurdleHeight, 0);
			tobj.strtTime = strtTimeA;
			tobj.endTime = parseInt(tobj.strtTime + tmpObj.flightTimeKick);
			this.enableStart(tmpObj, tobj);
			this.randRotateFar(tmpObj, randx, tobj.strtPos);
			this.randRotateClose(tmpObj, randx, tobj.endPos);
			this.postAdjustEndpos(tmpObj, tobj.endPos);
			strtTimeA = strtTimeA + tmpObj.jumpingKickDelay;
		}


		const stime = this.initSegment(tmpObj, strtTimeA, randx, 0);
		strtTimeA = parseInt(stime + this.xDeltaTime( tmpObj.flightTimeKick ));


		tmpObj.endTime = strtTimeA;
		tmpObj.dumbbellStrategy.initPotentialDisruptiveDumbbell(tmpObj, strtTimeI, tmpObj.endTime);

	} // init
	

} // LeftRoundhouseKickStrategy






// Strategy for a defensive maneuver consisting of a right front-ball kick followed by a right roundhouse kick.
class RightFrontKickThenRoundhouseStrategy extends Strategy {


    // Initializes an instance of the strategy.
	init(tmpObj, strtTimeI) {

		const split2 = tmpObj.referenceTimeSplit;
		const randx = Math.random();

		var strtTimeA = strtTimeI;


		// Potentially modifies to a jumping kick.
		if (Math.random() < 0.25) {
			const tobj = tmpObj.jumpHurdlesA[0];
			tobj.strtPos = new THREE.Vector3(0.0, tmpObj.jumpHurdleHeight, tmpObj.backDistBucket);
			tobj.endPos = new THREE.Vector3(0.0, tmpObj.jumpHurdleHeight, 0);
			tobj.strtTime = strtTimeA;
			tobj.endTime = parseInt(tobj.strtTime + tmpObj.flightTimeKick);
			this.enableStart(tmpObj, tobj);
			this.randRotateFar(tmpObj, randx, tobj.strtPos);
			this.randRotateClose(tmpObj, randx, tobj.endPos);
			this.postAdjustEndpos(tmpObj, tobj.endPos);
			strtTimeA = strtTimeA + tmpObj.jumpingKickDelay;
		}




		tmpObj.rightFrontKickAbdomenStrategy.initSegment(tmpObj, strtTimeA, randx, 0);






		{
			const startXA = 0.16;
			const tobj = tmpObj.targetsKickA[3];
			tobj.strtPos = new THREE.Vector3(startXA, tmpObj.jumpHurdleHeight, tmpObj.backDistBucket);
			tobj.endPos = new THREE.Vector3(startXA, tmpObj.jumpHurdleHeight, 0);
			tobj.strtTime = parseInt(strtTimeA + 4 * split2);
			tobj.endTime = parseInt(tobj.strtTime + tmpObj.flightTimeKick);
			this.enableStart(tmpObj, tobj);
			this.randRotateFar(tmpObj, randx, tobj.strtPos);
			this.randRotateClose(tmpObj, randx, tobj.endPos);
			this.postAdjustEndpos(tmpObj, tobj.endPos);
		}

		{
			const startXA = 0.16;
			const tobj = tmpObj.targetsKickA[4];
			tobj.strtPos = new THREE.Vector3(startXA, tmpObj.jumpHurdleHeight, tmpObj.backDistBucket);
			tobj.endPos = new THREE.Vector3(startXA, tmpObj.jumpHurdleHeight, 0);
			tobj.strtTime = parseInt(strtTimeA + 5 * split2);
			tobj.endTime = parseInt(tobj.strtTime + tmpObj.flightTimeKick);
			this.enableStart(tmpObj, tobj);
			this.randRotateFar(tmpObj, randx, tobj.strtPos);
			this.randRotateClose(tmpObj, randx, tobj.endPos);
			this.postAdjustEndpos(tmpObj, tobj.endPos);
		}

		{
			const startXA = 0.16;
			const tobj = tmpObj.targetsKickA[5];
			tobj.strtPos = new THREE.Vector3(startXA, tmpObj.jumpHurdleHeight, tmpObj.backDistBucket);
			tobj.endPos = new THREE.Vector3(startXA, tmpObj.jumpHurdleHeight, 0);
			tobj.strtTime = parseInt(strtTimeA + 6 * split2);
			tobj.endTime = parseInt(tobj.strtTime + tmpObj.flightTimeKick);
			this.enableStart(tmpObj, tobj);
			this.randRotateFar(tmpObj, randx, tobj.strtPos);
			this.randRotateClose(tmpObj, randx, tobj.endPos);
			this.postAdjustEndpos(tmpObj, tobj.endPos);
		}








		const stime = tmpObj.rightRoundhouseKickStrategy.initSegment(tmpObj, parseInt(strtTimeA + 8 * split2), randx, 6);
		strtTimeA = parseInt(stime + this.xDeltaTime( tmpObj.flightTimeKick ));


		tmpObj.endTime = strtTimeA;
		tmpObj.dumbbellStrategy.initPotentialDisruptiveDumbbell(tmpObj, strtTimeI, tmpObj.endTime);

	} // init
	

} // RightFrontKickThenRoundhouseStrategy







// Strategy for a defensive maneuver consisting of a left front-ball kick followed by a left roundhouse kick.
class LeftFrontKickThenRoundhouseStrategy extends Strategy {


    // Initializes an instance of the strategy.
	init(tmpObj, strtTimeI) {

		const split2 = tmpObj.referenceTimeSplit;
		const randx = Math.random();

		var strtTimeA = strtTimeI;


		// Potentially modifies to a jumping kick.
		if (Math.random() < 0.25) {
			const tobj = tmpObj.jumpHurdlesA[0];
			tobj.strtPos = new THREE.Vector3(0.0, tmpObj.jumpHurdleHeight, tmpObj.backDistBucket);
			tobj.endPos = new THREE.Vector3(0.0, tmpObj.jumpHurdleHeight, 0);
			tobj.strtTime = strtTimeA;
			tobj.endTime = parseInt(tobj.strtTime + tmpObj.flightTimeKick);
			this.enableStart(tmpObj, tobj);
			this.randRotateFar(tmpObj, randx, tobj.strtPos);
			this.randRotateClose(tmpObj, randx, tobj.endPos);
			this.postAdjustEndpos(tmpObj, tobj.endPos);
			strtTimeA = strtTimeA + tmpObj.jumpingKickDelay;
		}




		tmpObj.leftFrontKickAbdomenStrategy.initSegment(tmpObj, strtTimeA, randx, 0);




		{
			const startXA = -0.16;
			const tobj = tmpObj.targetsKickB[3];
			tobj.strtPos = new THREE.Vector3(startXA, tmpObj.jumpHurdleHeight, tmpObj.backDistBucket);
			tobj.endPos = new THREE.Vector3(startXA, tmpObj.jumpHurdleHeight, 0);
			tobj.strtTime = parseInt(strtTimeA + 4 * split2);
			tobj.endTime = parseInt(tobj.strtTime + tmpObj.flightTimeKick);
			this.enableStart(tmpObj, tobj);
			this.randRotateFar(tmpObj, randx, tobj.strtPos);
			this.randRotateClose(tmpObj, randx, tobj.endPos);
			this.postAdjustEndpos(tmpObj, tobj.endPos);
		}

		{
			const startXA = -0.16;
			const tobj = tmpObj.targetsKickB[4];
			tobj.strtPos = new THREE.Vector3(startXA, tmpObj.jumpHurdleHeight, tmpObj.backDistBucket);
			tobj.endPos = new THREE.Vector3(startXA, tmpObj.jumpHurdleHeight, 0);
			tobj.strtTime = parseInt(strtTimeA + 5 * split2);
			tobj.endTime = parseInt(tobj.strtTime + tmpObj.flightTimeKick);
			this.enableStart(tmpObj, tobj);
			this.randRotateFar(tmpObj, randx, tobj.strtPos);
			this.randRotateClose(tmpObj, randx, tobj.endPos);
			this.postAdjustEndpos(tmpObj, tobj.endPos);
		}

		{
			const startXA = -0.16;
			const tobj = tmpObj.targetsKickB[5];
			tobj.strtPos = new THREE.Vector3(startXA, tmpObj.jumpHurdleHeight, tmpObj.backDistBucket);
			tobj.endPos = new THREE.Vector3(startXA, tmpObj.jumpHurdleHeight, 0);
			tobj.strtTime = parseInt(strtTimeA + 6 * split2);
			tobj.endTime = parseInt(tobj.strtTime + tmpObj.flightTimeKick);
			this.enableStart(tmpObj, tobj);
			this.randRotateFar(tmpObj, randx, tobj.strtPos);
			this.randRotateClose(tmpObj, randx, tobj.endPos);
			this.postAdjustEndpos(tmpObj, tobj.endPos);
		}






		const stime = tmpObj.leftRoundhouseKickStrategy.initSegment(tmpObj, parseInt(strtTimeA + 8 * split2), randx, 6);
		strtTimeA = parseInt(stime + this.xDeltaTime( tmpObj.flightTimeKick ));


		tmpObj.endTime = strtTimeA;
		tmpObj.dumbbellStrategy.initPotentialDisruptiveDumbbell(tmpObj, strtTimeI, tmpObj.endTime);

	} // init
	

} // LeftFrontKickThenRoundhouseStrategy






// Strategy for a front-ball kick to the leg from the right.  The targets show the target of the kick only.
class RightFrontKickLegStrategy extends Strategy {


    // Initializes an instance of the strategy.
	init(tmpObj, strtTimeI) {

		const split2 = tmpObj.referenceTimeSplit;
		const randx = Math.random();

		var strtTimeA = strtTimeI;

		{
			const startXA = 0.16;
			const tobj = tmpObj.targetsKickA[0];
			tobj.strtPos = new THREE.Vector3(startXA, tmpObj.offenseHeight * (tmpObj.legHeight / tmpObj.idealHumanHeadHeights ), tmpObj.backDistBucket);
			tobj.endPos = new THREE.Vector3(startXA, tmpObj.offenseHeight * (tmpObj.legHeight / tmpObj.idealHumanHeadHeights ), 0);
			tobj.strtTime = strtTimeA;
			tobj.endTime = parseInt(tobj.strtTime + tmpObj.flightTimeKick);
			this.enableStart(tmpObj, tobj);
			this.randRotateFar(tmpObj, randx, tobj.strtPos);
			this.randRotateClose(tmpObj, randx, tobj.endPos);
			this.postAdjustEndpos(tmpObj, tobj.endPos);
		}

		{
			const startXA = 0.16;
			const tobj = tmpObj.targetsKickA[1];
			tobj.strtPos = new THREE.Vector3(startXA, tmpObj.offenseHeight * (tmpObj.legHeight / tmpObj.idealHumanHeadHeights ), tmpObj.backDistBucket);
			tobj.endPos = new THREE.Vector3(startXA, tmpObj.offenseHeight * (tmpObj.legHeight / tmpObj.idealHumanHeadHeights ), 0);
			tobj.strtTime = parseInt(strtTimeA + split2);
			tobj.endTime = parseInt(tobj.strtTime + tmpObj.flightTimeKick);
			this.enableStart(tmpObj, tobj);
			this.randRotateFar(tmpObj, randx, tobj.strtPos);
			this.randRotateClose(tmpObj, randx, tobj.endPos);
			this.postAdjustEndpos(tmpObj, tobj.endPos);
		}

		{
			const startXA = 0.16;
			const tobj = tmpObj.targetsKickA[2];
			tobj.strtPos = new THREE.Vector3(startXA, tmpObj.offenseHeight * (tmpObj.legHeight / tmpObj.idealHumanHeadHeights ), tmpObj.backDistBucket);
			tobj.endPos = new THREE.Vector3(startXA, tmpObj.offenseHeight * (tmpObj.legHeight / tmpObj.idealHumanHeadHeights ), 0);
			tobj.strtTime = parseInt(strtTimeA + split2 + split2);
			tobj.endTime = parseInt(tobj.strtTime + tmpObj.flightTimeKick);
			this.enableStart(tmpObj, tobj);
			this.randRotateFar(tmpObj, randx, tobj.strtPos);
			this.randRotateClose(tmpObj, randx, tobj.endPos);
			this.postAdjustEndpos(tmpObj, tobj.endPos);

			strtTimeA = parseInt(tobj.endTime + this.xDeltaTime( tmpObj.flightTimeKick ));
		}


		tmpObj.endTime = strtTimeA;
		tmpObj.dumbbellStrategy.initPotentialDisruptiveDumbbell(tmpObj, strtTimeI, tmpObj.endTime);

	} // init
	

} // RightFrontKickLegStrategy







// Strategy for a front-ball kick to the leg from the left.  The targets show the target of the kick only.
class LeftFrontKickLegStrategy extends Strategy {


    // Initializes an instance of the strategy.
	init(tmpObj, strtTimeI) {

		const split2 = tmpObj.referenceTimeSplit;
		const randx = Math.random();

		var strtTimeA = strtTimeI;

		{
			const startXA = -0.16;
			const tobj = tmpObj.targetsKickB[0];
			tobj.strtPos = new THREE.Vector3(startXA, tmpObj.offenseHeight * (tmpObj.legHeight / tmpObj.idealHumanHeadHeights ), tmpObj.backDistBucket);
			tobj.endPos = new THREE.Vector3(startXA, tmpObj.offenseHeight * (tmpObj.legHeight / tmpObj.idealHumanHeadHeights ), 0);
			tobj.strtTime = strtTimeA;
			tobj.endTime = parseInt(tobj.strtTime + tmpObj.flightTimeKick);
			this.enableStart(tmpObj, tobj);
			this.randRotateFar(tmpObj, randx, tobj.strtPos);
			this.randRotateClose(tmpObj, randx, tobj.endPos);
			this.postAdjustEndpos(tmpObj, tobj.endPos);
		}

		{
			const startXA = -0.16;
			const tobj = tmpObj.targetsKickB[1];
			tobj.strtPos = new THREE.Vector3(startXA, tmpObj.offenseHeight * (tmpObj.legHeight / tmpObj.idealHumanHeadHeights ), tmpObj.backDistBucket);
			tobj.endPos = new THREE.Vector3(startXA, tmpObj.offenseHeight * (tmpObj.legHeight / tmpObj.idealHumanHeadHeights ), 0);
			tobj.strtTime = parseInt(strtTimeA + split2);
			tobj.endTime = parseInt(tobj.strtTime + tmpObj.flightTimeKick);
			this.enableStart(tmpObj, tobj);
			this.randRotateFar(tmpObj, randx, tobj.strtPos);
			this.randRotateClose(tmpObj, randx, tobj.endPos);
			this.postAdjustEndpos(tmpObj, tobj.endPos);
		}

		{
			const startXA = -0.16;
			const tobj = tmpObj.targetsKickB[2];
			tobj.strtPos = new THREE.Vector3(startXA, tmpObj.offenseHeight * (tmpObj.legHeight / tmpObj.idealHumanHeadHeights ), tmpObj.backDistBucket);
			tobj.endPos = new THREE.Vector3(startXA, tmpObj.offenseHeight * (tmpObj.legHeight / tmpObj.idealHumanHeadHeights ), 0);
			tobj.strtTime = parseInt(strtTimeA + split2 + split2);
			tobj.endTime = parseInt(tobj.strtTime + tmpObj.flightTimeKick);
			this.enableStart(tmpObj, tobj);
			this.randRotateFar(tmpObj, randx, tobj.strtPos);
			this.randRotateClose(tmpObj, randx, tobj.endPos);
			this.postAdjustEndpos(tmpObj, tobj.endPos);

			strtTimeA = parseInt(tobj.endTime + this.xDeltaTime( tmpObj.flightTimeKick ));
		}


		tmpObj.endTime = strtTimeA;
		tmpObj.dumbbellStrategy.initPotentialDisruptiveDumbbell(tmpObj, strtTimeI, tmpObj.endTime);

	} // init
	

} // LeftFrontKickLegStrategy






// Strategy for a push kick from the right.
class RightPushKickStrategy extends Strategy {


    // Initializes an instance of the strategy.
	init(tmpObj, strtTimeI) {

		const split2 = tmpObj.referenceTimeSplit;
		const randx = Math.random();

		var strtTimeA = strtTimeI;

		{
			const startXA = 0.16;
			const tobj = tmpObj.targetsKickA[0];
			tobj.strtPos = new THREE.Vector3(startXA, tmpObj.offenseHeight * (tmpObj.pushKickTopHeight / tmpObj.idealHumanHeadHeights ), tmpObj.backDistBucket);
			tobj.endPos = new THREE.Vector3(startXA, tmpObj.offenseHeight * (tmpObj.pushKickTopHeight / tmpObj.idealHumanHeadHeights ), 0);
			tobj.strtTime = strtTimeA;
			tobj.endTime = parseInt(tobj.strtTime + tmpObj.flightTimeKick);
			this.enableStart(tmpObj, tobj);
			this.randRotateFar(tmpObj, randx, tobj.strtPos);
			this.randRotateClose(tmpObj, randx, tobj.endPos);
			this.postAdjustEndpos(tmpObj, tobj.endPos);
		}

		{
			const startXA = 0.16;
			const tobj = tmpObj.targetsKickA[1];
			tobj.strtPos = new THREE.Vector3(startXA, tmpObj.offenseHeight * (tmpObj.pushKickMiddleHeight / tmpObj.idealHumanHeadHeights ), tmpObj.backDistBucket);
			tobj.endPos = new THREE.Vector3(startXA, tmpObj.offenseHeight * (tmpObj.pushKickMiddleHeight / tmpObj.idealHumanHeadHeights ), 0);
			tobj.strtTime = parseInt(strtTimeA + split2);
			tobj.endTime = parseInt(tobj.strtTime + tmpObj.flightTimeKick);
			this.enableStart(tmpObj, tobj);
			this.randRotateFar(tmpObj, randx, tobj.strtPos);
			this.randRotateClose(tmpObj, randx, tobj.endPos);
			this.postAdjustEndpos(tmpObj, tobj.endPos);
		}

		{
			const startXA = 0.16;
			const tobj = tmpObj.targetsKickA[2];
			tobj.strtPos = new THREE.Vector3(startXA, tmpObj.offenseHeight * (tmpObj.pushKickBottomHeight / tmpObj.idealHumanHeadHeights ), tmpObj.backDistBucket);
			tobj.endPos = new THREE.Vector3(startXA, tmpObj.offenseHeight * (tmpObj.pushKickBottomHeight / tmpObj.idealHumanHeadHeights ), 0);
			tobj.strtTime = parseInt(strtTimeA + split2 + split2);
			tobj.endTime = parseInt(tobj.strtTime + tmpObj.flightTimeKick);
			this.enableStart(tmpObj, tobj);
			this.randRotateFar(tmpObj, randx, tobj.strtPos);
			this.randRotateClose(tmpObj, randx, tobj.endPos);
			this.postAdjustEndpos(tmpObj, tobj.endPos);

			strtTimeA = parseInt(tobj.endTime + this.xDeltaTime( tmpObj.flightTimeKick ));
		}


		tmpObj.endTime = strtTimeA;
		tmpObj.dumbbellStrategy.initPotentialDisruptiveDumbbell(tmpObj, strtTimeI, tmpObj.endTime);

	} // init
	

} // RightPushKickStrategy







// Strategy for a push kick from the left.
class LeftPushKickStrategy extends Strategy {


    // Initializes an instance of the strategy.
	init(tmpObj, strtTimeI) {

		const split2 = tmpObj.referenceTimeSplit;
		const randx = Math.random();

		var strtTimeA = strtTimeI;

		{
			const startXA = -0.16;
			const tobj = tmpObj.targetsKickB[0];
			tobj.strtPos = new THREE.Vector3(startXA, tmpObj.offenseHeight * (tmpObj.pushKickTopHeight / tmpObj.idealHumanHeadHeights ), tmpObj.backDistBucket);
			tobj.endPos = new THREE.Vector3(startXA, tmpObj.offenseHeight * (tmpObj.pushKickTopHeight / tmpObj.idealHumanHeadHeights ), 0);
			tobj.strtTime = strtTimeA;
			tobj.endTime = parseInt(tobj.strtTime + tmpObj.flightTimeKick);
			this.enableStart(tmpObj, tobj);
			this.randRotateFar(tmpObj, randx, tobj.strtPos);
			this.randRotateClose(tmpObj, randx, tobj.endPos);
			this.postAdjustEndpos(tmpObj, tobj.endPos);
		}

		{
			const startXA = -0.16;
			const tobj = tmpObj.targetsKickB[1];
			tobj.strtPos = new THREE.Vector3(startXA, tmpObj.offenseHeight * (tmpObj.pushKickMiddleHeight / tmpObj.idealHumanHeadHeights ), tmpObj.backDistBucket);
			tobj.endPos = new THREE.Vector3(startXA, tmpObj.offenseHeight * (tmpObj.pushKickMiddleHeight / tmpObj.idealHumanHeadHeights ), 0);
			tobj.strtTime = parseInt(strtTimeA + split2);
			tobj.endTime = parseInt(tobj.strtTime + tmpObj.flightTimeKick);
			this.enableStart(tmpObj, tobj);
			this.randRotateFar(tmpObj, randx, tobj.strtPos);
			this.randRotateClose(tmpObj, randx, tobj.endPos);
			this.postAdjustEndpos(tmpObj, tobj.endPos);
		}

		{
			const startXA = -0.16;
			const tobj = tmpObj.targetsKickB[2];
			tobj.strtPos = new THREE.Vector3(startXA, tmpObj.offenseHeight * (tmpObj.pushKickBottomHeight / tmpObj.idealHumanHeadHeights ), tmpObj.backDistBucket);
			tobj.endPos = new THREE.Vector3(startXA, tmpObj.offenseHeight * (tmpObj.pushKickBottomHeight / tmpObj.idealHumanHeadHeights ), 0);
			tobj.strtTime = parseInt(strtTimeA + split2 + split2);
			tobj.endTime = parseInt(tobj.strtTime + tmpObj.flightTimeKick);
			this.enableStart(tmpObj, tobj);
			this.randRotateFar(tmpObj, randx, tobj.strtPos);
			this.randRotateClose(tmpObj, randx, tobj.endPos);
			this.postAdjustEndpos(tmpObj, tobj.endPos);

			strtTimeA = parseInt(tobj.endTime + this.xDeltaTime( tmpObj.flightTimeKick ));
		}


		tmpObj.endTime = strtTimeA;
		tmpObj.dumbbellStrategy.initPotentialDisruptiveDumbbell(tmpObj, strtTimeI, tmpObj.endTime);

	} // init
	

} // LeftPushKickStrategy










// Strategy for a punch to the abdomen from the right.
class RightStraightAbdomenStrategy extends Strategy {


    // Initializes an instance of a segment of the strategy.
	initSegment(tmpObj, strtTimeI, randx, punchIndex) {

		const split2 = tmpObj.referenceTimeSplit;
		const split3 = 0.75 * split2;

		var strtTimeA = strtTimeI;

		{
			const startXA = 0.08;
			const tobj = tmpObj.targetsPunchA[ parseInt( punchIndex + 0 ) ];
			tobj.strtPos = new THREE.Vector3(startXA, tmpObj.offenseHeight * (tmpObj.abdomenHeight / tmpObj.idealHumanHeadHeights ), tmpObj.backDistBucket);
			tobj.endPos = new THREE.Vector3(startXA, tmpObj.offenseHeight * (tmpObj.abdomenHeight / tmpObj.idealHumanHeadHeights ), 0);
			tobj.strtTime = strtTimeA;
			tobj.endTime = parseInt(tobj.strtTime + tmpObj.flightTimeStraightPunch);
			this.enableStart(tmpObj, tobj);
			this.randRotateFar(tmpObj, randx, tobj.strtPos);
			this.randRotateClose(tmpObj, randx, tobj.endPos);
			this.postAdjustEndpos(tmpObj, tobj.endPos);
		}

		{
			const startXA = 0.0;
			const tobj = tmpObj.targetsPunchA[ parseInt( punchIndex + 1 ) ];
			tobj.strtPos = new THREE.Vector3(startXA, tmpObj.offenseHeight * (tmpObj.abdomenHeight / tmpObj.idealHumanHeadHeights ), tmpObj.backDistBucket);
			tobj.endPos = new THREE.Vector3(startXA, tmpObj.offenseHeight * (tmpObj.abdomenHeight / tmpObj.idealHumanHeadHeights ), 0);
			tobj.strtTime = parseInt(strtTimeA + split3);
			tobj.endTime = parseInt(tobj.strtTime + tmpObj.flightTimeStraightPunch);
			this.enableStart(tmpObj, tobj);
			this.randRotateFar(tmpObj, randx, tobj.strtPos);
			this.randRotateClose(tmpObj, randx, tobj.endPos);
			this.postAdjustEndpos(tmpObj, tobj.endPos);
		}

		{
			const startXA = -0.08;
			const tobj = tmpObj.targetsPunchA[ parseInt( punchIndex + 2 ) ];
			tobj.strtPos = new THREE.Vector3(startXA, tmpObj.offenseHeight * (tmpObj.abdomenHeight / tmpObj.idealHumanHeadHeights ), tmpObj.backDistBucket);
			tobj.endPos = new THREE.Vector3(startXA, tmpObj.offenseHeight * (tmpObj.abdomenHeight / tmpObj.idealHumanHeadHeights ), 0);
			tobj.strtTime = parseInt(strtTimeA + split3 + split3);
			tobj.endTime = parseInt(tobj.strtTime + tmpObj.flightTimeStraightPunch);
			this.enableStart(tmpObj, tobj);
			this.randRotateFar(tmpObj, randx, tobj.strtPos);
			this.randRotateClose(tmpObj, randx, tobj.endPos);
			this.postAdjustEndpos(tmpObj, tobj.endPos);

			strtTimeA = tobj.endTime;
		}
		
		return( strtTimeA );
	}  // initSegment


    // Initializes an instance of the strategy.
	init(tmpObj, strtTimeI) {

		const split2 = tmpObj.referenceTimeSplit;
		const randx = Math.random();
		const split3 = 0.75 * split2;

		var strtTimeA = strtTimeI;

		const stime = this.initSegment(tmpObj, strtTimeA, randx, 0);
		strtTimeA = parseInt(stime + this.xDeltaTime( tmpObj.flightTime ));


		tmpObj.endTime = strtTimeA;
		tmpObj.dumbbellStrategy.initPotentialDisruptiveDumbbell(tmpObj, strtTimeI, tmpObj.endTime);

	} // init
	

} // RightStraightAbdomenStrategy







// Strategy for a punch to the abdomen from the left.
class LeftStraightAbdomenStrategy extends Strategy {


    // Initializes an instance of a segment of the strategy.
	initSegment(tmpObj, strtTimeI, randx, punchIndex) {

		const split2 = tmpObj.referenceTimeSplit;
		const split3 = 0.75 * split2;

		var strtTimeA = strtTimeI;

		{
			const startXA = -0.08;
			const tobj = tmpObj.targetsPunchB[ parseInt( punchIndex + 0 ) ];
			tobj.strtPos = new THREE.Vector3(startXA, tmpObj.offenseHeight * (tmpObj.abdomenHeight / tmpObj.idealHumanHeadHeights ), tmpObj.backDistBucket);
			tobj.endPos = new THREE.Vector3(startXA, tmpObj.offenseHeight * (tmpObj.abdomenHeight / tmpObj.idealHumanHeadHeights ), 0);
			tobj.strtTime = strtTimeA;
			tobj.endTime = parseInt(tobj.strtTime + tmpObj.flightTimeStraightPunch);
			this.enableStart(tmpObj, tobj);
			this.randRotateFar(tmpObj, randx, tobj.strtPos);
			this.randRotateClose(tmpObj, randx, tobj.endPos);
			this.postAdjustEndpos(tmpObj, tobj.endPos);
		}

		{
			const startXA = 0.0;
			const tobj = tmpObj.targetsPunchB[ parseInt( punchIndex + 1 ) ];
			tobj.strtPos = new THREE.Vector3(startXA, tmpObj.offenseHeight * (tmpObj.abdomenHeight / tmpObj.idealHumanHeadHeights ), tmpObj.backDistBucket);
			tobj.endPos = new THREE.Vector3(startXA, tmpObj.offenseHeight * (tmpObj.abdomenHeight / tmpObj.idealHumanHeadHeights ), 0);
			tobj.strtTime = parseInt(strtTimeA + split3);
			tobj.endTime = parseInt(tobj.strtTime + tmpObj.flightTimeStraightPunch);
			this.enableStart(tmpObj, tobj);
			this.randRotateFar(tmpObj, randx, tobj.strtPos);
			this.randRotateClose(tmpObj, randx, tobj.endPos);
			this.postAdjustEndpos(tmpObj, tobj.endPos);
		}

		{
			const startXA = 0.08;
			const tobj = tmpObj.targetsPunchB[ parseInt( punchIndex + 2 ) ];
			tobj.strtPos = new THREE.Vector3(startXA, tmpObj.offenseHeight * (tmpObj.abdomenHeight / tmpObj.idealHumanHeadHeights ), tmpObj.backDistBucket);
			tobj.endPos = new THREE.Vector3(startXA, tmpObj.offenseHeight * (tmpObj.abdomenHeight / tmpObj.idealHumanHeadHeights ), 0);
			tobj.strtTime = parseInt(strtTimeA + split3 + split3);
			tobj.endTime = parseInt(tobj.strtTime + tmpObj.flightTimeStraightPunch);
			this.enableStart(tmpObj, tobj);
			this.randRotateFar(tmpObj, randx, tobj.strtPos);
			this.randRotateClose(tmpObj, randx, tobj.endPos);
			this.postAdjustEndpos(tmpObj, tobj.endPos);

			strtTimeA = tobj.endTime;
		}
		
		return( strtTimeA );
	}  // initSegment


    // Initializes an instance of the strategy.
	init(tmpObj, strtTimeI) {

		const split2 = tmpObj.referenceTimeSplit;
		const randx = Math.random();
		const split3 = 0.75 * split2;

		var strtTimeA = strtTimeI;

		const stime = this.initSegment(tmpObj, strtTimeA, randx, 0);
		strtTimeA = parseInt(stime + this.xDeltaTime( tmpObj.flightTime ));


		tmpObj.endTime = strtTimeA;
		tmpObj.dumbbellStrategy.initPotentialDisruptiveDumbbell(tmpObj, strtTimeI, tmpObj.endTime);

	} // init
	

} // LeftStraightAbdomenStrategy


























// Strategy for a train of punches to the abdomen starting from the right potentially followed by another higher strike.
class RightStraightBodyTrainStrategy extends Strategy {




    // Initializes an instance of a segment of the strategy.
	initSegment(tmpObj, strtTimeI, randx, punchIndex) {

		const split2 = tmpObj.referenceTimeSplit;
		const split3 = 0.75 * split2;

		var strtTimeA = strtTimeI;





		tmpObj.rightStraightAbdomenStrategy.initSegment(tmpObj, strtTimeA, randx, punchIndex);




		strtTimeA = strtTimeI + 2 * split3 + 2 * split2;





		tmpObj.leftStraightAbdomenStrategy.initSegment(tmpObj, strtTimeA, randx, punchIndex);







	} // initSegment



    // Initializes an instance of the strategy.
	init(tmpObj, strtTimeI) {

		const split2 = tmpObj.referenceTimeSplit;
		const randx = Math.random();
		const split3 = 0.75 * split2;

		var strtTimeA = strtTimeI;


		this.initSegment(tmpObj, strtTimeA, randx, 0);


		this.initSegment(tmpObj, strtTimeA + 4 * split2 + 4 * split3, randx, 3);

		var endIndex = parseInt(6);
		var endSplit2 = parseInt(8);
		var endSplit3 = parseInt(8);
		var fEnd = tmpObj.flightTimeStraightPunch;


		if (Math.random() > 0.5) {
			// Nothing
		}
		else {
			this.initSegment(tmpObj, strtTimeA + endSplit2 * split2 + endSplit3 * split3, randx, 6);

			endSplit2 = parseInt(endSplit2 + 4);
			endSplit3 = parseInt(endSplit3 + 4);
			endIndex = parseInt(9);
		}
		tmpObj.dumbbellStrategy.initPotentialDisruptiveDumbbell(tmpObj, strtTimeI, tmpObj.endTime);


		if (Math.random() < 0.5) {
			if (Math.random() > 0.25) {
				tmpObj.rightUppercutStrategy.initSegment(tmpObj, strtTimeA + endSplit2 * split2 + endSplit3 * split3, randx, endIndex);
				fEnd = tmpObj.flightTime;
				endSplit2 = parseInt(endSplit2 + 4);
			}
			else {
				tmpObj.dumbbellStrategy.initSequenceDisruptiveDumbbell(tmpObj, strtTimeA + endSplit2 * split2 + endSplit3 * split3, 0);
				fEnd = tmpObj.flightTimeStraightPunch;
				endSplit2 = parseInt(endSplit2 + 2);
			}
		}


		tmpObj.endTime = parseInt(strtTimeA + (endSplit2 - 2) * split2 + endSplit3 * split3 + fEnd);


	} // init


} // RightStraightBodyTrainStrategy







// Strategy for a train of punches to the abdomen starting from the left potentially followed by another higher strike.
class LeftStraightBodyTrainStrategy extends Strategy {




    // Initializes an instance of a segment of the strategy.
	initSegment(tmpObj, strtTimeI, randx, punchIndex) {

		const split2 = tmpObj.referenceTimeSplit;
		const split3 = 0.75 * split2;

		var strtTimeA = strtTimeI;





		tmpObj.leftStraightAbdomenStrategy.initSegment(tmpObj, strtTimeA, randx, punchIndex);




		strtTimeA = strtTimeI + 2 * split3 + 2 * split2;





		tmpObj.rightStraightAbdomenStrategy.initSegment(tmpObj, strtTimeA, randx, punchIndex);







	} // initSegment



    // Initializes an instance of the strategy.
	init(tmpObj, strtTimeI) {

		const split2 = tmpObj.referenceTimeSplit;
		const randx = Math.random();
		const split3 = 0.75 * split2;

		var strtTimeA = strtTimeI;


		this.initSegment(tmpObj, strtTimeA, randx, 0);


		this.initSegment(tmpObj, strtTimeA + 4 * split2 + 4 * split3, randx, 3);

		var endIndex = parseInt(6);
		var endSplit2 = parseInt(8);
		var endSplit3 = parseInt(8);
		var fEnd = tmpObj.flightTimeStraightPunch;


		if (Math.random() > 0.5) {
			// Nothing
		}
		else {
			this.initSegment(tmpObj, strtTimeA + endSplit2 * split2 + endSplit3 * split3, randx, 6);

			endSplit2 = parseInt(endSplit2 + 4);
			endSplit3 = parseInt(endSplit3 + 4);
			endIndex = parseInt(9);
		}
		tmpObj.dumbbellStrategy.initPotentialDisruptiveDumbbell(tmpObj, strtTimeI, tmpObj.endTime);


		if (Math.random() < 0.5) {
			if (Math.random() > 0.25) {
				tmpObj.leftUppercutStrategy.initSegment(tmpObj, strtTimeA + endSplit2 * split2 + endSplit3 * split3, randx, endIndex);
				fEnd = tmpObj.flightTime;
				endSplit2 = parseInt(endSplit2 + 4);
			}
			else {
				tmpObj.dumbbellStrategy.initSequenceDisruptiveDumbbell(tmpObj, strtTimeA + endSplit2 * split2 + endSplit3 * split3, 0);
				fEnd = tmpObj.flightTimeStraightPunch;
				endSplit2 = parseInt(endSplit2 + 2);
			}
		}


		tmpObj.endTime = parseInt(strtTimeA + (endSplit2 - 2) * split2 + endSplit3 * split3 + fEnd);


	} // init


} // LeftStraightBodyTrainStrategy


















// Strategy for a right punch to the solarplex.
class RightStraightSolarplexStrategy extends Strategy {


    // Initializes an instance of the strategy.
	init(tmpObj, strtTimeI) {

		const split2 = tmpObj.referenceTimeSplit;
		const randx = Math.random();
		const split3 = 0.75 * split2;

		var strtTimeA = strtTimeI;

		{
			const startXA = 0.08;
			const tobj = tmpObj.targetsPunchA[0];
			tobj.strtPos = new THREE.Vector3(startXA, tmpObj.offenseHeight * (tmpObj.solarplexHeight / tmpObj.idealHumanHeadHeights ), tmpObj.backDistBucket);
			tobj.endPos = new THREE.Vector3(startXA, tmpObj.offenseHeight * (tmpObj.solarplexHeight / tmpObj.idealHumanHeadHeights ), 0);
			tobj.strtTime = strtTimeA;
			tobj.endTime = parseInt(tobj.strtTime + tmpObj.flightTimeStraightPunch);
			this.enableStart(tmpObj, tobj);
			this.randRotateFar(tmpObj, randx, tobj.strtPos);
			this.randRotateClose(tmpObj, randx, tobj.endPos);
			this.postAdjustEndpos(tmpObj, tobj.endPos);
		}

		{
			const startXA = 0.0;
			const tobj = tmpObj.targetsPunchA[1];
			tobj.strtPos = new THREE.Vector3(startXA, tmpObj.offenseHeight * (tmpObj.solarplexHeight / tmpObj.idealHumanHeadHeights ), tmpObj.backDistBucket);
			tobj.endPos = new THREE.Vector3(startXA, tmpObj.offenseHeight * (tmpObj.solarplexHeight / tmpObj.idealHumanHeadHeights ), 0);
			tobj.strtTime = parseInt(strtTimeA + split3);
			tobj.endTime = parseInt(tobj.strtTime + tmpObj.flightTimeStraightPunch);
			this.enableStart(tmpObj, tobj);
			this.randRotateFar(tmpObj, randx, tobj.strtPos);
			this.randRotateClose(tmpObj, randx, tobj.endPos);
			this.postAdjustEndpos(tmpObj, tobj.endPos);
		}

		{
			const startXA = -0.08;
			const tobj = tmpObj.targetsPunchA[2];
			tobj.strtPos = new THREE.Vector3(startXA, tmpObj.offenseHeight * (tmpObj.solarplexHeight / tmpObj.idealHumanHeadHeights ), tmpObj.backDistBucket);
			tobj.endPos = new THREE.Vector3(startXA, tmpObj.offenseHeight * (tmpObj.solarplexHeight / tmpObj.idealHumanHeadHeights ), 0);
			tobj.strtTime = parseInt(strtTimeA + split3 + split3);
			tobj.endTime = parseInt(tobj.strtTime + tmpObj.flightTimeStraightPunch);
			this.enableStart(tmpObj, tobj);
			this.randRotateFar(tmpObj, randx, tobj.strtPos);
			this.randRotateClose(tmpObj, randx, tobj.endPos);
			this.postAdjustEndpos(tmpObj, tobj.endPos);

			strtTimeA = parseInt(tobj.endTime + this.xDeltaTime( tmpObj.flightTime ));
		}


		tmpObj.endTime = strtTimeA;

	} // init
	

} // RightStraightSolarplexStrategy







// Strategy for a left punch to the solarplex.
class LeftStraightSolarplexStrategy extends Strategy {


    // Initializes an instance of the strategy.
	init(tmpObj, strtTimeI) {

		const split2 = tmpObj.referenceTimeSplit;
		const randx = Math.random();
		const split3 = 0.75 * split2;

		var strtTimeA = strtTimeI;

		{
			const startXA = -0.08;
			const tobj = tmpObj.targetsPunchB[0];
			tobj.strtPos = new THREE.Vector3(startXA, tmpObj.offenseHeight * (tmpObj.solarplexHeight / tmpObj.idealHumanHeadHeights ), tmpObj.backDistBucket);
			tobj.endPos = new THREE.Vector3(startXA, tmpObj.offenseHeight * (tmpObj.solarplexHeight / tmpObj.idealHumanHeadHeights ), 0);
			tobj.strtTime = strtTimeA;
			tobj.endTime = parseInt(tobj.strtTime + tmpObj.flightTimeStraightPunch);
			this.enableStart(tmpObj, tobj);
			this.randRotateFar(tmpObj, randx, tobj.strtPos);
			this.randRotateClose(tmpObj, randx, tobj.endPos);
			this.postAdjustEndpos(tmpObj, tobj.endPos);
		}

		{
			const startXA = 0.0;
			const tobj = tmpObj.targetsPunchB[1];
			tobj.strtPos = new THREE.Vector3(startXA, tmpObj.offenseHeight * (tmpObj.solarplexHeight / tmpObj.idealHumanHeadHeights ), tmpObj.backDistBucket);
			tobj.endPos = new THREE.Vector3(startXA, tmpObj.offenseHeight * (tmpObj.solarplexHeight / tmpObj.idealHumanHeadHeights ), 0);
			tobj.strtTime = parseInt(strtTimeA + split3);
			tobj.endTime = parseInt(tobj.strtTime + tmpObj.flightTimeStraightPunch);
			this.enableStart(tmpObj, tobj);
			this.randRotateFar(tmpObj, randx, tobj.strtPos);
			this.randRotateClose(tmpObj, randx, tobj.endPos);
			this.postAdjustEndpos(tmpObj, tobj.endPos);
		}

		{
			const startXA = 0.08;
			const tobj = tmpObj.targetsPunchB[2];
			tobj.strtPos = new THREE.Vector3(startXA, tmpObj.offenseHeight * (tmpObj.solarplexHeight / tmpObj.idealHumanHeadHeights ), tmpObj.backDistBucket);
			tobj.endPos = new THREE.Vector3(startXA, tmpObj.offenseHeight * (tmpObj.solarplexHeight / tmpObj.idealHumanHeadHeights ), 0);
			tobj.strtTime = parseInt(strtTimeA + split3 + split3);
			tobj.endTime = parseInt(tobj.strtTime + tmpObj.flightTimeStraightPunch);
			this.enableStart(tmpObj, tobj);
			this.randRotateFar(tmpObj, randx, tobj.strtPos);
			this.randRotateClose(tmpObj, randx, tobj.endPos);
			this.postAdjustEndpos(tmpObj, tobj.endPos);

			strtTimeA = parseInt(tobj.endTime + this.xDeltaTime( tmpObj.flightTime ));
		}


		tmpObj.endTime = strtTimeA;

	} // init
	

} // LeftStraightSolarplexStrategy


















// Strategy for generating a hammer strike on the right side.
class RightHammerStrikeStrategy extends Strategy {


    // Initializes an instance of the strategy.
	init(tmpObj, strtTimeI) {

		const split2 = tmpObj.referenceTimeSplit;
		const randx = Math.random();

		var strtTimeA = strtTimeI;

		{
			const startXA = 0.08;
			const tobj = tmpObj.targetsPunchA[0];
			tobj.strtPos = new THREE.Vector3(startXA, tmpObj.offenseHeight * (tmpObj.hammerStrikeHeight / tmpObj.idealHumanHeadHeights ) + startXA, tmpObj.backDistBucket);
			tobj.endPos = new THREE.Vector3(startXA, tmpObj.offenseHeight * (tmpObj.hammerStrikeHeight / tmpObj.idealHumanHeadHeights ) + startXA, 0);
			tobj.strtTime = strtTimeA;
			tobj.endTime = parseInt(tobj.strtTime + tmpObj.flightTime);
			this.enableStart(tmpObj, tobj);
			this.randRotateFar(tmpObj, randx, tobj.strtPos);
			this.randRotateClose(tmpObj, randx, tobj.endPos);
			this.postAdjustEndpos(tmpObj, tobj.endPos);
		}

		{
			const startXA = 0.00;
			const tobj = tmpObj.targetsPunchA[1];
			tobj.strtPos = new THREE.Vector3(startXA, tmpObj.offenseHeight * (tmpObj.hammerStrikeHeight / tmpObj.idealHumanHeadHeights ) + startXA, tmpObj.backDistBucket);
			tobj.endPos = new THREE.Vector3(startXA, tmpObj.offenseHeight * (tmpObj.hammerStrikeHeight / tmpObj.idealHumanHeadHeights ) + startXA, 0);
			tobj.strtTime = parseInt(strtTimeA + split2);
			tobj.endTime = parseInt(tobj.strtTime + tmpObj.flightTime);
			this.enableStart(tmpObj, tobj);
			this.randRotateFar(tmpObj, randx, tobj.strtPos);
			this.randRotateClose(tmpObj, randx, tobj.endPos);
			this.postAdjustEndpos(tmpObj, tobj.endPos);
		}

		{
			const startXA = -0.08;
			const tobj = tmpObj.targetsPunchA[2];
			tobj.strtPos = new THREE.Vector3(startXA, tmpObj.offenseHeight * (tmpObj.hammerStrikeHeight / tmpObj.idealHumanHeadHeights ) + startXA, tmpObj.backDistBucket);
			tobj.endPos = new THREE.Vector3(startXA, tmpObj.offenseHeight * (tmpObj.hammerStrikeHeight / tmpObj.idealHumanHeadHeights ) + startXA, 0);
			tobj.strtTime = parseInt(strtTimeA + split2 + split2);
			tobj.endTime = parseInt(tobj.strtTime + tmpObj.flightTime);
			this.enableStart(tmpObj, tobj);
			this.randRotateFar(tmpObj, randx, tobj.strtPos);
			this.randRotateClose(tmpObj, randx, tobj.endPos);
			this.postAdjustEndpos(tmpObj, tobj.endPos);

			strtTimeA = parseInt(tobj.endTime + this.xDeltaTime( tmpObj.flightTime ));
		}


		tmpObj.endTime = strtTimeA;
		tmpObj.dumbbellStrategy.initPotentialDisruptiveDumbbell(tmpObj, strtTimeI, tmpObj.endTime);

	} // init
	

} // RightHammerStrikeStrategy







// Strategy for generating a hammer strike on the left side.
class LeftHammerStrikeStrategy extends Strategy {


    // Initializes an instance of the strategy.
	init(tmpObj, strtTimeI) {

		const split2 = tmpObj.referenceTimeSplit;
		const randx = Math.random();

		var strtTimeA = strtTimeI;

		{
			const startXA = -0.08;
			const tobj = tmpObj.targetsPunchB[0];
			tobj.strtPos = new THREE.Vector3(startXA, tmpObj.offenseHeight * (tmpObj.hammerStrikeHeight / tmpObj.idealHumanHeadHeights ) - startXA, tmpObj.backDistBucket);
			tobj.endPos = new THREE.Vector3(startXA, tmpObj.offenseHeight * (tmpObj.hammerStrikeHeight / tmpObj.idealHumanHeadHeights ) - startXA, 0);
			tobj.strtTime = strtTimeA;
			tobj.endTime = parseInt(tobj.strtTime + tmpObj.flightTime);
			this.enableStart(tmpObj, tobj);
			this.randRotateFar(tmpObj, randx, tobj.strtPos);
			this.randRotateClose(tmpObj, randx, tobj.endPos);
			this.postAdjustEndpos(tmpObj, tobj.endPos);
		}

		{
			const startXA = 0.00;
			const tobj = tmpObj.targetsPunchB[1];
			tobj.strtPos = new THREE.Vector3(startXA, tmpObj.offenseHeight * (tmpObj.hammerStrikeHeight / tmpObj.idealHumanHeadHeights ) - startXA, tmpObj.backDistBucket);
			tobj.endPos = new THREE.Vector3(startXA, tmpObj.offenseHeight * (tmpObj.hammerStrikeHeight / tmpObj.idealHumanHeadHeights ) - startXA, 0);
			tobj.strtTime = parseInt(strtTimeA + split2);
			tobj.endTime = parseInt(tobj.strtTime + tmpObj.flightTime);
			this.enableStart(tmpObj, tobj);
			this.randRotateFar(tmpObj, randx, tobj.strtPos);
			this.randRotateClose(tmpObj, randx, tobj.endPos);
			this.postAdjustEndpos(tmpObj, tobj.endPos);
		}

		{
			const startXA = 0.08;
			const tobj = tmpObj.targetsPunchB[2];
			tobj.strtPos = new THREE.Vector3(startXA, tmpObj.offenseHeight * (tmpObj.hammerStrikeHeight / tmpObj.idealHumanHeadHeights ) - startXA, tmpObj.backDistBucket);
			tobj.endPos = new THREE.Vector3(startXA, tmpObj.offenseHeight * (tmpObj.hammerStrikeHeight / tmpObj.idealHumanHeadHeights ) - startXA, 0);
			tobj.strtTime = parseInt(strtTimeA + split2 + split2);
			tobj.endTime = parseInt(tobj.strtTime + tmpObj.flightTime);
			this.enableStart(tmpObj, tobj);
			this.randRotateFar(tmpObj, randx, tobj.strtPos);
			this.randRotateClose(tmpObj, randx, tobj.endPos);
			this.postAdjustEndpos(tmpObj, tobj.endPos);

			strtTimeA = parseInt(tobj.endTime + this.xDeltaTime( tmpObj.flightTime ));
		}


		tmpObj.endTime = strtTimeA;
		tmpObj.dumbbellStrategy.initPotentialDisruptiveDumbbell(tmpObj, strtTimeI, tmpObj.endTime);

	} // init
	

} // LeftHammerStrikeStrategy











// Strategy to occupy the right hand with a set of targets on the left before generating a dumbbell or hurdle.
class RightOccupyStrategy extends Strategy {


    // Initializes an instance of the strategy.
	init(tmpObj, strtTimeI) {

		const split2 = tmpObj.referenceTimeSplit;
		const randx = 0.1;

		var strtTimeA = strtTimeI;

		const stime = tmpObj.rightHookHeadStrategy.initSegment(tmpObj, strtTimeA, randx, 0);
		strtTimeA = parseInt(stime + this.xDeltaTime( tmpObj.flightTime ));





		if (Math.random() < 0.666) {
			tmpObj.dumbbellStrategy.initIntervalDisruptiveDumbbell(tmpObj, tmpObj.targetsPunchA[0].strtTime, tmpObj.targetsPunchA[2].endTime, 0);
		}
		else {
			const rand = Math.random();
			var startXA = 0;
			startXA = tmpObj.bucketXOffset;
			const tobj = tmpObj.jumpHurdlesA[0];
			tobj.strtPos = new THREE.Vector3(startXA, tmpObj.jumpHurdleHeight, tmpObj.backDistBucket);
			tobj.endPos = new THREE.Vector3(0, tmpObj.jumpHurdleHeight, 0);
			tobj.strtTime = strtTimeA;
			tobj.endTime = parseInt(tobj.strtTime + tmpObj.flightTime);
			this.postAdjustEndpos(tmpObj, tobj.endPos);
			this.enableStart(tmpObj, tobj);

			strtTimeA = parseInt(tobj.endTime + this.xDeltaTime( tmpObj.flightTime ));
		}



		tmpObj.endTime = strtTimeA;
		tmpObj.dumbbellStrategy.initPotentialDisruptiveDumbbell(tmpObj, strtTimeI, tmpObj.endTime);

	} // init
	

} // RightOccupyStrategy







// Strategy to occupy the left hand with a set of targets on the right before generating a dumbbell or hurdle.
class LeftOccupyStrategy extends Strategy {


    // Initializes an instance of the strategy.
	init(tmpObj, strtTimeI) {

		const split2 = tmpObj.referenceTimeSplit;
		const randx = 0.5;

		var strtTimeA = strtTimeI;

		const stime = tmpObj.leftHookHeadStrategy.initSegment(tmpObj, strtTimeA, randx, 0);
		strtTimeA = parseInt(stime + this.xDeltaTime( tmpObj.flightTime ));





		if (Math.random() < 0.666) {
			tmpObj.dumbbellStrategy.initIntervalDisruptiveDumbbell(tmpObj, tmpObj.targetsPunchB[0].strtTime, tmpObj.targetsPunchB[2].endTime, 0);
		}
		else {
			const rand = Math.random();
			var startXA = 0;
			startXA = -tmpObj.bucketXOffset;
			const tobj = tmpObj.jumpHurdlesA[0];
			tobj.strtPos = new THREE.Vector3(startXA, tmpObj.jumpHurdleHeight, tmpObj.backDistBucket);
			tobj.endPos = new THREE.Vector3(0, tmpObj.jumpHurdleHeight, 0);
			tobj.strtTime = strtTimeA;
			tobj.endTime = parseInt(tobj.strtTime + tmpObj.flightTime);
			this.postAdjustEndpos(tmpObj, tobj.endPos);
			this.enableStart(tmpObj, tobj);

			strtTimeA = parseInt(tobj.endTime + this.xDeltaTime( tmpObj.flightTime ));
		}



		tmpObj.endTime = strtTimeA;
		tmpObj.dumbbellStrategy.initPotentialDisruptiveDumbbell(tmpObj, strtTimeI, tmpObj.endTime);

	} // init
	

} // LeftOccupyStrategy











// Strategy to occupy the right hand with three sets of targets on the left before generating a dumbbell or hurdle.
class TripleRightOccupyStrategy extends Strategy {


    // Initializes an instance of the strategy.
	init(tmpObj, strtTimeI) {

		const split2 = tmpObj.referenceTimeSplit;
		const randx = 0.1;

		var strtTimeA = strtTimeI;





		const stime = tmpObj.rightHookHeadStrategy.initSegment(tmpObj, strtTimeA, randx, 0);
		strtTimeA = parseInt(stime + this.xDeltaTime( tmpObj.flightTime ));





		const stime2 = tmpObj.rightHookHeadStrategy.initSegment(tmpObj, strtTimeA, randx, 3);
		strtTimeA = parseInt(stime2 + this.xDeltaTime( tmpObj.flightTime ));





		const stime3 = tmpObj.rightHookHeadStrategy.initSegment(tmpObj, strtTimeA, randx, 6);
		strtTimeA = parseInt(stime3 + this.xDeltaTime( tmpObj.flightTime ));





		if (Math.random() < 0.666) {
			tmpObj.dumbbellStrategy.initIntervalDisruptiveDumbbell(tmpObj, tmpObj.targetsPunchA[6].strtTime, tmpObj.targetsPunchA[8].endTime, 0);
		}
		else {
			const rand = Math.random();
			var startXA = 0;
			startXA = tmpObj.bucketXOffset;
			const tobj = tmpObj.jumpHurdlesA[0];
			tobj.strtPos = new THREE.Vector3(startXA, tmpObj.jumpHurdleHeight, tmpObj.backDistBucket);
			tobj.endPos = new THREE.Vector3(0, tmpObj.jumpHurdleHeight, 0);
			tobj.strtTime = strtTimeA;
			tobj.endTime = parseInt(tobj.strtTime + tmpObj.flightTime);
			this.postAdjustEndpos(tmpObj, tobj.endPos);
			this.enableStart(tmpObj, tobj);

			strtTimeA = parseInt(tobj.endTime + this.xDeltaTime( tmpObj.flightTime ));
		}



		tmpObj.endTime = strtTimeA;
		tmpObj.dumbbellStrategy.initPotentialDisruptiveDumbbell(tmpObj, strtTimeI, tmpObj.endTime);


		var dd = [];

		const INCHES_TO_CENTIMETERS = 2.54;
		const CENTIMETERS_TO_METERS = 0.01;
		const FEET_TO_INCHES = 12;

		if ((tmpObj.offenseHeight - tmpObj.defenseHeight) > (2 * INCHES_TO_CENTIMETERS * CENTIMETERS_TO_METERS)) {
			dd[0] = tmpObj.leftUppercutStrategy;

			dd[1] = tmpObj.rightUppercutStrategy;
		}
		else {
			dd[0] = tmpObj.leftHookHeadStrategy;

			dd[1] = tmpObj.rightHookHeadStrategy;

			dd[2] = tmpObj.leftUppercutStrategy;

			dd[3] = tmpObj.rightUppercutStrategy;

			dd[4] = tmpObj.leftHammerStrikeStrategy;

			dd[5] = tmpObj.rightHammerStrikeStrategy;
		}

		var randn = parseInt(Math.floor(Math.random() * dd.length));

		tmpObj.nextSequence = dd[randn];


	} // init


} // TripleRightOccupyStrategy







// Strategy to occupy the left hand with three sets of targets on the right before generating a dumbbell or hurdle.
class TripleLeftOccupyStrategy extends Strategy {


    // Initializes an instance of the strategy.
	init(tmpObj, strtTimeI) {

		const split2 = tmpObj.referenceTimeSplit;
		const randx = 0.5;

		var strtTimeA = strtTimeI;





		const stime = tmpObj.leftHookHeadStrategy.initSegment(tmpObj, strtTimeA, randx, 0);
		strtTimeA = parseInt(stime + this.xDeltaTime( tmpObj.flightTime ));





		const stime2 = tmpObj.leftHookHeadStrategy.initSegment(tmpObj, strtTimeA, randx, 3);
		strtTimeA = parseInt(stime2 + this.xDeltaTime( tmpObj.flightTime ));





		const stime3 = tmpObj.leftHookHeadStrategy.initSegment(tmpObj, strtTimeA, randx, 6);
		strtTimeA = parseInt(stime3 + this.xDeltaTime( tmpObj.flightTime ));





		if (Math.random() < 0.666) {
			tmpObj.dumbbellStrategy.initIntervalDisruptiveDumbbell(tmpObj, tmpObj.targetsPunchB[6].strtTime, tmpObj.targetsPunchB[8].endTime, 0);
		}
		else {
			const rand = Math.random();
			var startXA = 0;
			startXA = -tmpObj.bucketXOffset;
			const tobj = tmpObj.jumpHurdlesA[0];
			tobj.strtPos = new THREE.Vector3(startXA, tmpObj.jumpHurdleHeight, tmpObj.backDistBucket);
			tobj.endPos = new THREE.Vector3(0, tmpObj.jumpHurdleHeight, 0);
			tobj.strtTime = strtTimeA;
			tobj.endTime = parseInt(tobj.strtTime + tmpObj.flightTime);
			this.postAdjustEndpos(tmpObj, tobj.endPos);
			this.enableStart(tmpObj, tobj);

			strtTimeA = parseInt(tobj.endTime + this.xDeltaTime( tmpObj.flightTime ));
		}



		tmpObj.endTime = strtTimeA;
		tmpObj.dumbbellStrategy.initPotentialDisruptiveDumbbell(tmpObj, strtTimeI, tmpObj.endTime);


		var dd = [];

		const INCHES_TO_CENTIMETERS = 2.54;
		const CENTIMETERS_TO_METERS = 0.01;
		const FEET_TO_INCHES = 12;

		if ((tmpObj.offenseHeight - tmpObj.defenseHeight) > (2 * INCHES_TO_CENTIMETERS * CENTIMETERS_TO_METERS)) {
			dd[0] = tmpObj.leftUppercutStrategy;

			dd[1] = tmpObj.rightUppercutStrategy;
		}
		else {
			dd[0] = tmpObj.leftHookHeadStrategy;

			dd[1] = tmpObj.rightHookHeadStrategy;

			dd[2] = tmpObj.leftUppercutStrategy;

			dd[3] = tmpObj.rightUppercutStrategy;

			dd[4] = tmpObj.leftHammerStrikeStrategy;

			dd[5] = tmpObj.rightHammerStrikeStrategy;
		}

		var randn = parseInt(Math.floor(Math.random() * dd.length));

		tmpObj.nextSequence = dd[randn];


	} // init
	

} // TripleLeftOccupyStrategy







// Strategy for generating random dumbbels.
class DumbbellStrategy extends Strategy {



    // Generates a disruptive dumbbell between the start time and the end time.
	initPotentialDisruptiveDumbbell(tmpObj, strtTimeI, endTimeI) {

		if ((Math.random() < 0.1) && (((-0.05) + endTimeI - strtTimeI) > tmpObj.flightTimeDumbbell)) {
			const iDelta = (endTimeI - strtTimeI) - tmpObj.flightTimeDumbbell;
			const strtTimeA = strtTimeI + iDelta * (Math.random());
			const rand = Math.random();
			var startXA = 0;
			if (rand < 0.3333) startXA = -tmpObj.bucketXOffset;
			if (rand > 0.6666) startXA = tmpObj.bucketXOffset;
			const tobj = tmpObj.dumbbelsA[tmpObj.maxDumbbels - 1];
			tobj.strtPos = new THREE.Vector3(startXA, tmpObj.defenseHeight * (tmpObj.dumbbellHeight / tmpObj.idealHumanHeadHeights ), tmpObj.backDistBucket);
			tobj.endPos = new THREE.Vector3(0, tmpObj.defenseHeight * (tmpObj.dumbbellHeight / tmpObj.idealHumanHeadHeights ), 0);
			if (Math.random() < 0.1) {
				const insideI = Math.abs(startXA) < 0.1;
				const startYA = insideI ? tmpObj.defenseHeight - 0.16 - 0.25 * tmpObj.backDistBucket :
					tmpObj.defenseHeight - 0.16 + 0.25 * tmpObj.bucketHypotenuse;
				tobj.strtPos.y = startYA;
			}
			tobj.strtTime = strtTimeA;
			tobj.endTime = parseInt(tobj.strtTime + tmpObj.flightTimeDumbbell);
			this.postAdjustEndpos(tmpObj, tobj.endPos);
			this.enableStart(tmpObj, tobj);
		}

	}



    // Generates a disruptive dumbbell between the start time and the end time.
	initIntervalDisruptiveDumbbell(tmpObj, strtTimeI, endTimeI, dumbbellIndex) {

		if (((-0.05) + endTimeI - strtTimeI) > tmpObj.flightTimeDumbbell) {
			const iDelta = (endTimeI - strtTimeI) - tmpObj.flightTimeDumbbell;
			const strtTimeA = strtTimeI + iDelta * (Math.random());
			const rand = Math.random();
			var startXA = 0;
			if (rand < 0.3333) startXA = -tmpObj.bucketXOffset;
			if (rand > 0.6666) startXA = tmpObj.bucketXOffset;
			const tobj = tmpObj.dumbbelsA[dumbbellIndex];
			tobj.strtPos = new THREE.Vector3(startXA, tmpObj.defenseHeight * (tmpObj.dumbbellHeight / tmpObj.idealHumanHeadHeights ), tmpObj.backDistBucket);
			tobj.endPos = new THREE.Vector3(0, tmpObj.defenseHeight * (tmpObj.dumbbellHeight / tmpObj.idealHumanHeadHeights ), 0);
			if (Math.random() < 0.1) {
				const insideI = Math.abs(startXA) < 0.1;
				const startYA = insideI ? tmpObj.defenseHeight - 0.16 - 0.25 * tmpObj.backDistBucket :
					tmpObj.defenseHeight - 0.16 + 0.25 * tmpObj.bucketHypotenuse;
				tobj.strtPos.y = startYA;
			}
			tobj.strtTime = strtTimeA;
			tobj.endTime = parseInt(tobj.strtTime + tmpObj.flightTimeDumbbell);
			this.postAdjustEndpos(tmpObj, tobj.endPos);
			this.enableStart(tmpObj, tobj);
		}

	}




    // Generates a disruptive dumbbell in sequence at the start time.
	initSequenceDisruptiveDumbbell(tmpObj, strtTimeI, dumbbellIndex) {

		const strtTimeA = strtTimeI;
		const rand = Math.random();
		var startXA = 0;
		if (rand < 0.3333) startXA = -tmpObj.bucketXOffset;
		if (rand > 0.6666) startXA = tmpObj.bucketXOffset;
		const tobj = tmpObj.dumbbelsA[dumbbellIndex];
		tobj.strtPos = new THREE.Vector3(startXA, tmpObj.defenseHeight * (tmpObj.dumbbellHeight / tmpObj.idealHumanHeadHeights ), tmpObj.backDistBucket);
		tobj.endPos = new THREE.Vector3(0, tmpObj.defenseHeight * (tmpObj.dumbbellHeight / tmpObj.idealHumanHeadHeights ), 0);
		if (Math.random() < 0.1) {
			const insideI = Math.abs(startXA) < 0.1;
			const startYA = insideI ? tmpObj.defenseHeight - 0.16 - 0.25 * tmpObj.backDistBucket :
				tmpObj.defenseHeight - 0.16 + 0.25 * tmpObj.bucketHypotenuse;
			tobj.strtPos.y = startYA;
		}
		tobj.strtTime = strtTimeA;
		tobj.endTime = parseInt(tobj.strtTime + tmpObj.flightTimeDumbbell);
		this.postAdjustEndpos(tmpObj, tobj.endPos);
		this.enableStart(tmpObj, tobj);

	}




    // Initializes an instance of the strategy.
	init(tmpObj, strtTimeI) {

		const split2 = tmpObj.referenceTimeSplit;

		var strtTimeA = strtTimeI;
		var strtTimeB = strtTimeI;

		{
			const rand = Math.random();
			var startXA = 0;
			if (rand < 0.3333) startXA = -tmpObj.bucketXOffset;
			if (rand > 0.6666) startXA = tmpObj.bucketXOffset;
			const tobj = tmpObj.dumbbelsA[0];
			tobj.strtPos = new THREE.Vector3(startXA, tmpObj.defenseHeight * (tmpObj.dumbbellHeight / tmpObj.idealHumanHeadHeights ), tmpObj.backDistBucket);
			tobj.endPos = new THREE.Vector3(0, tmpObj.defenseHeight * (tmpObj.dumbbellHeight / tmpObj.idealHumanHeadHeights ), 0);
			if (Math.random() < 0.1) {
				const insideI = Math.abs(startXA) < 0.1;
				const startYA = insideI ? tmpObj.defenseHeight - 0.16 - 0.25 * tmpObj.backDistBucket :
					tmpObj.defenseHeight - 0.16 + 0.25 * tmpObj.bucketHypotenuse;
				tobj.strtPos.y = startYA;
			}
			tobj.strtTime = strtTimeA;
			tobj.endTime = parseInt(tobj.strtTime + tmpObj.flightTimeDumbbell);
			this.postAdjustEndpos(tmpObj, tobj.endPos);
			this.enableStart(tmpObj, tobj);

			strtTimeA = parseInt(tobj.endTime + this.xDeltaTime( tmpObj.flightTimeDumbbell ));
		}



		if (Math.random() < 0.2) {
			const rand = Math.random();
			var startXA = 0;
			if (rand < 0.3333) startXA = -tmpObj.bucketXOffset;
			if (rand > 0.6666) startXA = tmpObj.bucketXOffset;
			const tobj = tmpObj.dumbbelsA[1];
			tobj.strtPos = new THREE.Vector3(startXA, tmpObj.defenseHeight * (tmpObj.dumbbellHeight / tmpObj.idealHumanHeadHeights ), tmpObj.backDistBucket);
			tobj.endPos = new THREE.Vector3(0, tmpObj.defenseHeight * (tmpObj.dumbbellHeight / tmpObj.idealHumanHeadHeights ), 0);
			if (Math.random() < 0.1) {
				const insideI = Math.abs(startXA) < 0.1;
				const startYA = insideI ? tmpObj.defenseHeight - 0.16 - 0.25 * tmpObj.backDistBucket :
					tmpObj.defenseHeight - 0.16 + 0.25 * tmpObj.bucketHypotenuse;
				tobj.strtPos.y = startYA;
			}
			tobj.strtTime = parseInt(strtTimeB + split2 + split2);
			tobj.endTime = parseInt(tobj.strtTime + tmpObj.flightTimeDumbbell);
			this.postAdjustEndpos(tmpObj, tobj.endPos);
			this.enableStart(tmpObj, tobj);

			strtTimeB = parseInt(tobj.endTime + this.xDeltaTime( tmpObj.flightTimeDumbbell ));
		}



		tmpObj.endTime = strtTimeA;
		if (strtTimeB > strtTimeA) {
			tmpObj.endTime = strtTimeB;
		}


	} // init
	

} // DumbbellStrategy








// Strategy for generating some random jump hurdles.
class JumpHurdleStrategy extends Strategy {


    // Initializes an instance of the strategy.
	init(tmpObj, strtTimeI) {

		const split2 = tmpObj.referenceTimeSplit;

		var strtTimeA = strtTimeI;
		var strtTimeB = strtTimeI;

		{
			const rand = Math.random();
			var startXA = 0;
			if (rand < 0.3333) startXA = -tmpObj.bucketXOffset;
			if (rand > 0.6666) startXA = tmpObj.bucketXOffset;
			const tobj = tmpObj.jumpHurdlesA[0];
			tobj.strtPos = new THREE.Vector3(startXA, tmpObj.jumpHurdleHeight, tmpObj.backDistBucket);
			tobj.endPos = new THREE.Vector3(0, tmpObj.jumpHurdleHeight, 0);
			tobj.strtTime = strtTimeA;
			tobj.endTime = parseInt(tobj.strtTime + tmpObj.flightTime);
			this.postAdjustEndpos(tmpObj, tobj.endPos);
			this.enableStart(tmpObj, tobj);

			strtTimeA = parseInt(tobj.endTime + this.xDeltaTime( tmpObj.flightTime ));
		}



		if (Math.random() < 0.2) {
			const rand = Math.random();
			var startXA = 0;
			if (rand < 0.3333) startXA = -tmpObj.bucketXOffset;
			if (rand > 0.6666) startXA = tmpObj.bucketXOffset;
			const tobj = tmpObj.jumpHurdlesA[1];
			tobj.strtPos = new THREE.Vector3(startXA, tmpObj.jumpHurdleHeight, tmpObj.backDistBucket);
			tobj.endPos = new THREE.Vector3(0, tmpObj.jumpHurdleHeight, 0);
			tobj.strtTime = parseInt(strtTimeB + split2 + split2);
			tobj.endTime = parseInt(tobj.strtTime + tmpObj.flightTime);
			this.postAdjustEndpos(tmpObj, tobj.endPos);
			this.enableStart(tmpObj, tobj);

			strtTimeB = parseInt(tobj.endTime + this.xDeltaTime( tmpObj.flightTime ));
		}



		tmpObj.endTime = strtTimeA;
		if (strtTimeB > strtTimeA) {
			tmpObj.endTime = strtTimeB;
		}


	} // init


} // JumpHurdleStrategy














// Strategy for Parallel Hops as a means of providing additional conditioning.
class ParallelHopsStrategy extends Strategy {




    // Initializes an instance of a segment of the strategy.
	initSegment(tmpObj, strtTimeI, randx, startXA, kckIndex, hurdleIndex) {

		const split2 = tmpObj.referenceTimeSplit;

		var strtTimeA = strtTimeI;





		{
			const tobj = tmpObj.jumpHurdlesA[parseInt(0 + hurdleIndex)];
			tobj.strtPos = new THREE.Vector3(startXA, tmpObj.jumpHurdleHeight, tmpObj.backDistBucket);
			tobj.endPos = new THREE.Vector3(startXA, tmpObj.jumpHurdleHeight, 0);
			tobj.strtTime = strtTimeA;
			tobj.endTime = parseInt(tobj.strtTime + tmpObj.flightTime);
			this.enableStart(tmpObj, tobj);
			this.randRotateFar(tmpObj, randx, tobj.strtPos);
			this.randRotateClose(tmpObj, randx, tobj.endPos);
			this.postAdjustEndpos(tmpObj, tobj.endPos);
		}




		strtTimeA = strtTimeI + 2 * split2;






		{
			const tobj = tmpObj.targetsKickA[0 + kckIndex];
			tobj.strtPos = new THREE.Vector3(startXA + 0.16, tmpObj.jumpHurdleHeight, tmpObj.backDistBucket);
			tobj.endPos = new THREE.Vector3(startXA + 0.16, tmpObj.jumpHurdleHeight, 0);
			tobj.strtTime = strtTimeA;
			tobj.endTime = parseInt(tobj.strtTime + tmpObj.flightTime);
			this.enableStart(tmpObj, tobj);
			this.randRotateFar(tmpObj, randx, tobj.strtPos);
			this.randRotateClose(tmpObj, randx, tobj.endPos);
			this.postAdjustEndpos(tmpObj, tobj.endPos);
		}

		{
			const tobj = tmpObj.targetsKickA[1 + kckIndex];
			tobj.strtPos = new THREE.Vector3(startXA + 0.16, tmpObj.jumpHurdleHeight, tmpObj.backDistBucket);
			tobj.endPos = new THREE.Vector3(startXA + 0.16, tmpObj.jumpHurdleHeight, 0);
			tobj.strtTime = parseInt(strtTimeA + split2);
			tobj.endTime = parseInt(tobj.strtTime + tmpObj.flightTime);
			this.enableStart(tmpObj, tobj);
			this.randRotateFar(tmpObj, randx, tobj.strtPos);
			this.randRotateClose(tmpObj, randx, tobj.endPos);
			this.postAdjustEndpos(tmpObj, tobj.endPos);
		}

		{
			const tobj = tmpObj.targetsKickA[2 + kckIndex];
			tobj.strtPos = new THREE.Vector3(startXA + 0.16, tmpObj.jumpHurdleHeight, tmpObj.backDistBucket);
			tobj.endPos = new THREE.Vector3(startXA + 0.16, tmpObj.jumpHurdleHeight, 0);
			tobj.strtTime = parseInt(strtTimeA + split2 + split2);
			tobj.endTime = parseInt(tobj.strtTime + tmpObj.flightTime);
			this.enableStart(tmpObj, tobj);
			this.randRotateFar(tmpObj, randx, tobj.strtPos);
			this.randRotateClose(tmpObj, randx, tobj.endPos);
			this.postAdjustEndpos(tmpObj, tobj.endPos);
		}










		{
			const tobj = tmpObj.targetsKickB[0 + kckIndex];
			tobj.strtPos = new THREE.Vector3(startXA - 0.16, tmpObj.jumpHurdleHeight, tmpObj.backDistBucket);
			tobj.endPos = new THREE.Vector3(startXA - 0.16, tmpObj.jumpHurdleHeight, 0);
			tobj.strtTime = strtTimeA;
			tobj.endTime = parseInt(tobj.strtTime + tmpObj.flightTime);
			this.enableStart(tmpObj, tobj);
			this.randRotateFar(tmpObj, randx, tobj.strtPos);
			this.randRotateClose(tmpObj, randx, tobj.endPos);
			this.postAdjustEndpos(tmpObj, tobj.endPos);
		}

		{
			const tobj = tmpObj.targetsKickB[1 + kckIndex];
			tobj.strtPos = new THREE.Vector3(startXA - 0.16, tmpObj.jumpHurdleHeight, tmpObj.backDistBucket);
			tobj.endPos = new THREE.Vector3(startXA - 0.16, tmpObj.jumpHurdleHeight, 0);
			tobj.strtTime = parseInt(strtTimeA + split2);
			tobj.endTime = parseInt(tobj.strtTime + tmpObj.flightTime);
			this.enableStart(tmpObj, tobj);
			this.randRotateFar(tmpObj, randx, tobj.strtPos);
			this.randRotateClose(tmpObj, randx, tobj.endPos);
			this.postAdjustEndpos(tmpObj, tobj.endPos);
		}

		{
			const tobj = tmpObj.targetsKickB[2 + kckIndex];
			tobj.strtPos = new THREE.Vector3(startXA - 0.16, tmpObj.jumpHurdleHeight, tmpObj.backDistBucket);
			tobj.endPos = new THREE.Vector3(startXA - 0.16, tmpObj.jumpHurdleHeight, 0);
			tobj.strtTime = parseInt(strtTimeA + split2 + split2);
			tobj.endTime = parseInt(tobj.strtTime + tmpObj.flightTime);
			this.enableStart(tmpObj, tobj);
			this.randRotateFar(tmpObj, randx, tobj.strtPos);
			this.randRotateClose(tmpObj, randx, tobj.endPos);
			this.postAdjustEndpos(tmpObj, tobj.endPos);
		}







	} // initSegment







    // Initializes an instance of the strategy.
	init(tmpObj, strtTimeI) {

		const split2 = tmpObj.referenceTimeSplit;
		const randx = Math.random();

		var strtTimeA = strtTimeI;



		this.initSegment(tmpObj, strtTimeA, randx, 0.16, 0, 0);


		this.initSegment(tmpObj, strtTimeA + 7 * split2, randx, -0.16, 3, 1);


		this.initSegment(tmpObj, strtTimeA + 14 * split2, randx, 0.16, 6, 2);


		this.initSegment(tmpObj, strtTimeA + 21 * split2, randx, -0.16, 9, 3);


		if (Math.random() > 0.25) {
			tmpObj.endTime = strtTimeA + 28 * split2 + tmpObj.flightTime;
		}
		else {
			this.initSegment(tmpObj, strtTimeA + 28 * split2, randx, 0.16, 12, 4);

			this.initSegment(tmpObj, strtTimeA + 35 * split2, randx, -0.16, 15, 5);

			tmpObj.endTime = strtTimeA + 42 * split2 + tmpObj.flightTime;
		}

		tmpObj.dumbbellStrategy.initPotentialDisruptiveDumbbell(tmpObj, strtTimeI, tmpObj.endTime);





	} // init




} // ParallelHopsStrategy


















// Strategy with four rounds of an offensive strategy followed by a defensive strategy.
class QuadRoundStrategy extends Strategy {


    // Initializes an instance of the strategy.
	init(tmpObj, strtTimeI) {

		const strategies = [];

		const INCHES_TO_CENTIMETERS = 2.54;
		const CENTIMETERS_TO_METERS = 0.01;
		const FEET_TO_INCHES = 12;

		if ((tmpObj.offenseHeight - tmpObj.defenseHeight) > (2 * INCHES_TO_CENTIMETERS * CENTIMETERS_TO_METERS)) {
			strategies[0] = tmpObj.rightUppercutStrategy;

			strategies[1] = tmpObj.leftUppercutStrategy;

			strategies[2] = tmpObj.rightFrontKickAbdomenStrategy;

			strategies[3] = tmpObj.leftFrontKickAbdomenStrategy;

			strategies[4] = tmpObj.rightRoundhouseKickStrategy;

			strategies[5] = tmpObj.leftRoundhouseKickStrategy;

			strategies[6] = tmpObj.rightUppercutJumpStrategy;

			strategies[7] = tmpObj.leftUppercutJumpStrategy;

			strategies[8] = tmpObj.rightSideBladeKickAbdomenStrategy;

			strategies[9] = tmpObj.leftSideBladeKickAbdomenStrategy;

			strategies[10] = tmpObj.rightSideBladeKickTrainAbdomenStrategy;

			strategies[11] = tmpObj.leftSideBladeKickTrainAbdomenStrategy;
		}
		else {
			strategies[0] = tmpObj.rightHookHeadStrategy;

			strategies[1] = tmpObj.leftHookHeadStrategy;

			strategies[2] = tmpObj.rightUppercutStrategy;

			strategies[3] = tmpObj.leftUppercutStrategy;

			strategies[4] = tmpObj.rightFrontKickAbdomenStrategy;

			strategies[5] = tmpObj.leftFrontKickAbdomenStrategy;

			strategies[6] = tmpObj.rightRoundhouseKickStrategy;

			strategies[7] = tmpObj.leftRoundhouseKickStrategy;

			strategies[8] = tmpObj.rightUppercutJumpStrategy;

			strategies[9] = tmpObj.leftUppercutJumpStrategy;

			strategies[10] = tmpObj.leftHammerStrikeStrategy;

			strategies[11] = tmpObj.rightHammerStrikeStrategy;

			strategies[12] = tmpObj.rightSideBladeKickAbdomenStrategy;

			strategies[13] = tmpObj.leftSideBladeKickAbdomenStrategy;

			strategies[14] = tmpObj.rightSideBladeKickTrainAbdomenStrategy;

			strategies[15] = tmpObj.leftSideBladeKickTrainAbdomenStrategy;
		}


		const strategiesD = [];

		strategiesD[0] = tmpObj.dumbbellStrategy;

		strategiesD[1] = tmpObj.jumpHurdleStrategy;




		const str9 = new ContainerStrategy();
		var randn = parseInt(Math.floor(Math.random() * strategies.length));
		str9.immediateSequence = strategies[randn];
		str9.nextSequence = null;


		const str8 = new ContainerStrategy();
		randn = parseInt(Math.floor(Math.random() * strategiesD.length));
		str8.immediateSequence = strategiesD[randn];
		str8.nextSequence = str9;


		const str7 = new ContainerStrategy();
		randn = parseInt(Math.floor(Math.random() * strategies.length));
		str7.immediateSequence = strategies[randn];
		str7.nextSequence = str8;


		const str6 = new ContainerStrategy();
		randn = parseInt(Math.floor(Math.random() * strategiesD.length));
		str6.immediateSequence = strategiesD[randn];
		str6.nextSequence = str7;


		const str5 = new ContainerStrategy();
		randn = parseInt(Math.floor(Math.random() * strategies.length));
		str5.immediateSequence = strategies[randn];
		str5.nextSequence = str6;


		const str4 = new ContainerStrategy();
		randn = parseInt(Math.floor(Math.random() * strategiesD.length));
		str4.immediateSequence = strategiesD[randn];
		str4.nextSequence = str5;


		const str3 = new ContainerStrategy();
		randn = parseInt(Math.floor(Math.random() * strategies.length));
		str3.immediateSequence = strategies[randn];
		str3.nextSequence = str4;


		const str2 = new ContainerStrategy();
		randn = parseInt(Math.floor(Math.random() * strategiesD.length));
		str2.immediateSequence = strategiesD[randn];
		str2.nextSequence = str3;


		randn = parseInt(Math.floor(Math.random() * strategies.length));
		strategies[randn].init(tmpObj, strtTimeI);
		tmpObj.nextSequence = str2;


	} // init

} // QuadRoundStrategy


















// Strategy for moves in which the player is on offense.
class OffenseLegStrategy extends Strategy {


    // Initializes an instance of the strategy.
	init(tmpObj, strtTimeI) {

		const randx = Math.random();

		if (randx <= 0.3333333) {
			const randn = parseInt(Math.floor(Math.random() * tmpObj.strategiesOffenseLegRight.length));

			return tmpObj.strategiesOffenseLegRight[randn].init(tmpObj, strtTimeI);
		}

		if (randx <= 0.66666666) {
			const randn = parseInt(Math.floor(Math.random() * tmpObj.strategiesOffenseLegLeft.length));

			return tmpObj.strategiesOffenseLegLeft[randn].init(tmpObj, strtTimeI);
		}


		const randn = parseInt(Math.floor(Math.random() * tmpObj.strategiesOffenseLegMid.length));

		return tmpObj.strategiesOffenseLegMid[randn].init(tmpObj, strtTimeI);


	} // init

} // OffenseLegStrategy














var gl, cube, bucketL1, bucketL2, bucketL3, marker1, marker2, light, scene, canvas, glContext, tmpObj;
init();
animate();



// Handles the initialization of the script.
function init() {

	const dt = new Date();
	const millis = parseInt(dt.getMilliseconds());
	const millis2 = parseInt(millis % 777);
	for (let cnt = 0; cnt < millis2; cnt++) {
		var vv = Math.random();
	}

	// create context
	gl = new THREE.WebGLRenderer({ antialias: true });
	gl.setPixelRatio(window.devicePixelRatio);
	gl.setSize(window.innerWidth, window.innerHeight);
	gl.outputEncoding = THREE.sRGBEncoding;
	gl.xr.enabled = true;
	document.body.appendChild(gl.domElement);
	document.body.appendChild(VRButton.createButton(gl));


	// tmpObj
	tmpObj = {};


	// create camera
	const angleOfView = 55;
	const aspectRatio = window.innerWidth / window.innerHeight;
	const nearPlane = 0.1;
	const farPlane = 1000;
	tmpObj.camera = new THREE.PerspectiveCamera(
		angleOfView,
		aspectRatio,
		nearPlane,
		farPlane
	);
	const initialCameraY = 2; /* 8 */
	const initialCameraZ = 2; /* 30 */
	tmpObj.camera.position.set(0, initialCameraY, initialCameraZ);
	tmpObj.realCamera = tmpObj.camera;

	// create the scene
	scene = new THREE.Scene();
	scene.background = new THREE.Color(0x77b5fe);
	const fog = new THREE.Fog("grey", 1, 90);



	// audio
	tmpObj.audioLoader = new THREE.AudioLoader();
	tmpObj.audioListener = new THREE.AudioListener();
	tmpObj.camera.add(tmpObj.audioListener);
	processAudioCtx(tmpObj);
	tmpObj.dumbbellHeight = 5.75;
	tmpObj.pushKickTopHeight = 2.0;
	tmpObj.pushKickMiddleHeight = 1.25;
	tmpObj.pushKickBottomHeight = 0.5;
	tmpObj.legHeight = 2.5;
	tmpObj.uppercutHeight = 7.0;
	tmpObj.hookHeadHeight = 7.666;
	tmpObj.solarplexHeight = 6.0;
	tmpObj.abdomenHeight = 5.0;
	tmpObj.uppercutJumpHeight = 8.0;
	tmpObj.hammerStrikeHeight = 8.0;
	tmpObj.idealHumanHeadHeights = 8.0;
	tmpObj.dumbbellHits = parseInt(0);
	tmpObj.prevDumbbellHits = parseInt(-1);
	tmpObj.rightPunchHits = parseInt(0);
	tmpObj.prevRightPunchHits = parseInt(-1);
	tmpObj.leftPunchHits = parseInt(0);
	tmpObj.prevLeftPunchHits = parseInt(-1);
	tmpObj.masterFontSizeMultiplier = 0.0125;
	tmpObj.fontSizeMultiplierScoring = 0.75;
	tmpObj.jumpHurdleHeight = 0.05;
	tmpObj.updateDumbbellHits = true;
	tmpObj.updateLeftPunchHits = true;
	tmpObj.updateRightPunchHits = true;
	tmpObj.backDistBucket = -7;
	tmpObj.bucketXOffset = 3.8;
	tmpObj.dumbbellHitText = document.getElementById( "dumbbellHitText" );
	tmpObj.leftPunchText = document.getElementById( "leftPunchText" );
	tmpObj.rightPunchText = document.getElementById( "rightPunchText" );
	tmpObj.playerHeightFeetText = document.getElementById( "playerHeightFeetText" );
	tmpObj.playerHeightInchesText = document.getElementById( "playerHeightInchesText" );
	tmpObj.difficultyText = document.getElementById( "difficultyText" );

    tmpObj.difficultyText.value = 50;

	{
	    var difficulty = parseFloat( tmpObj.difficultyText.value );
	    if( isNaN( difficulty ) )
	    {
	        difficulty = 50;
	    }
	    if( difficulty < 2 )
	    {
	        difficulty = 2;
	    }
	    tmpObj.referenceTimeSplit = parseInt( ( difficulty / 50.0 ) * 250 / 2.1);
	    tmpObj.randomStrategyTimeSplit = parseInt( ( difficulty / 50.0 ) * 500 / 2);
		const split2 = tmpObj.referenceTimeSplit;
		tmpObj.flightTime = parseInt(split2 * 5 * 1.6);
		tmpObj.flightTimeKick = parseInt(split2 * 5 * 1.6 * 1.2);
		tmpObj.flightTimeStraightPunch = parseInt(split2 * 5 * 1.6 * 0.8);
		tmpObj.flightTimeDumbbell = parseInt(split2 * 5 * 1.6 * 0.8);
		tmpObj.jumpingKickDelay = 1.5 * split2;
	}
	
	tmpObj.playerHeightFeetText.value = 6;
	tmpObj.playerHeightInchesText.value = 2;



	// GEOMETRY
	// create the cube
	const cubeSize = 4;
	const cubeGeometry = new THREE.BoxGeometry(
		cubeSize,
		cubeSize,
		cubeSize
	);

	// create the cube
	const bucketL2Height = 3;
	const bucketL2Width = 1.0;
	const bucketL2Geometry = new THREE.BoxGeometry(
		bucketL2Width,
		bucketL2Height,
		bucketL2Width
	);
	
	const markerHeight = 0.02;
	const markerDepth = 0.04;
	const markerLength = 2.0 * tmpObj.bucketXOffset;
	const marker1Geometry = new THREE.BoxGeometry(
		markerLength,
		markerHeight,
		markerDepth /* 10.0 */
	);
	const marker2Geometry = new THREE.BoxGeometry(
		markerDepth,
		markerHeight,
		/* markerLength */ 20.0
	);
	

	// create the target geometry
	tmpObj.targetPunchSize = 0.16;
	const targetPunchGeometry = new THREE.BoxGeometry(
		tmpObj.targetPunchSize,
		tmpObj.targetPunchSize,
		tmpObj.targetPunchSize
	);

	// create the target geometry
	const targetKickSize = 0.16;
	const targetKickGeometry = new THREE.TetrahedronGeometry(
		targetKickSize,
		0
	);

	// create the dumbbell geometry
	tmpObj.dumbbellSize = 0.16;
	const dumbbellGeometry = new THREE.BoxGeometry(
		tmpObj.dumbbellSize,
		tmpObj.dumbbellSize,
		tmpObj.dumbbellSize
	);

	// create the jump hurdle geometry
	const jumpHurdleSizeY = 0.16;
	const jumpHurdleSizeXZ = 0.46;
	const jumpHurdleGeometry = new THREE.BoxGeometry(
		jumpHurdleSizeXZ,
		jumpHurdleSizeY,
		jumpHurdleSizeXZ
	);

	// Create the upright plane
	const planeWidth = 256;
	const planeHeight = 128;
	const planeGeometry = new THREE.PlaneGeometry(
		planeWidth,
		planeHeight
	);

	// MATERIALS
	const textureLoader = new THREE.TextureLoader();

	const cubeMaterial = new THREE.MeshPhongMaterial({
		color: 'pink'
	});

	const bucketL2Material = new THREE.MeshPhongMaterial({
		color: 0xf1edc2
	});

	const markerMaterial = new THREE.MeshPhongMaterial({
		color: 0x5500bb
	});

	const targetMaterialA = new THREE.MeshPhongMaterial({
		color: 0xe46a54
	});

	const targetMaterialB = new THREE.MeshPhongMaterial({
		color: 0xb4ecbb
	});

	const dumbbellMaterialA = new THREE.MeshPhongMaterial({
		color: 0x252729
	});

	const jumpHurdleMaterialA = new THREE.MeshPhongMaterial({
		color: 0xf1edc2
	});

	tmpObj.textMaterial = new THREE.MeshPhongMaterial({
		color: 0xffc000
	});

	tmpObj.endTime = parseInt(-5000);
	tmpObj.nextSequence = null;


	const planeTextureMap = textureLoader.load('textures/177.jpg');
	planeTextureMap.wrapS = THREE.RepeatWrapping;
	planeTextureMap.wrapT = THREE.RepeatWrapping;
	planeTextureMap.repeat.set(16, 16);
	//planeTextureMap.magFilter = THREE.NearestFilter;
	planeTextureMap.minFilter = THREE.NearestFilter;
	planeTextureMap.anisotropy = gl.capabilities.getMaxAnisotropy();
	const planeNorm = textureLoader.load('textures/177_norm.jpg');
	planeNorm.wrapS = THREE.RepeatWrapping;
	planeNorm.wrapT = THREE.RepeatWrapping;
	planeNorm.minFilter = THREE.NearestFilter;
	planeNorm.repeat.set(16, 16);
	const planeMaterial = new THREE.MeshStandardMaterial({
		map: planeTextureMap,
		side: THREE.DoubleSide,
		normalMap: planeNorm
	});
	scene.fog = fog;

	const fontLoader = new THREE.FontLoader();

	tmpObj.bucketHypotenuse = Math.sqrt(
		tmpObj.backDistBucket * tmpObj.backDistBucket +
		tmpObj.bucketXOffset * tmpObj.bucketXOffset
	);

	tmpObj.bucketCosine = - tmpObj.backDistBucket / tmpObj.bucketHypotenuse;

	tmpObj.bucketSine = tmpObj.bucketXOffset / tmpObj.bucketHypotenuse;

	tmpObj.bucketDistRatio = - tmpObj.bucketHypotenuse / tmpObj.backDistBucket;

	// MESHES
	cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
	cube.position.set(-(cubeSize + 1), cubeSize + 1, 0);
	scene.add(cube);

	bucketL1 = new THREE.Mesh(bucketL2Geometry, bucketL2Material);
	bucketL1.position.set(-tmpObj.bucketXOffset, bucketL2Height - 2, tmpObj.backDistBucket);
	scene.add(bucketL1);

	bucketL2 = new THREE.Mesh(bucketL2Geometry, bucketL2Material);
	bucketL2.position.set(0, bucketL2Height - 2, tmpObj.backDistBucket);
	scene.add(bucketL2);

	bucketL3 = new THREE.Mesh(bucketL2Geometry, bucketL2Material);
	bucketL3.position.set(tmpObj.bucketXOffset, bucketL2Height - 2, tmpObj.backDistBucket);
	scene.add(bucketL3);

	marker1 = new THREE.Mesh(marker1Geometry, markerMaterial);
	marker1.position.set(-0, 0, 0);
	scene.add(marker1);

	marker2 = new THREE.Mesh(marker2Geometry, markerMaterial);
	marker2.position.set(-0, 0, 0);
	scene.add(marker2);

	tmpObj.maxTargets = parseInt(18 /* 15 */ /* 10 */);
	tmpObj.maxDumbbels = parseInt(6);
	tmpObj.maxJumpHurdles = parseInt(6);
	tmpObj.utimeStrt = parseInt(-5500);
	tmpObj.utimeEnd = parseInt(-5000);
	tmpObj.targetFarDist = -10;

	tmpObj.targetsPunchA = [];
	for (let cnt = parseInt(0); cnt < tmpObj.maxTargets; cnt++) {
		tmpObj.targetsPunchA[cnt] = {};
		const tobj = tmpObj.targetsPunchA[cnt];
		tobj.strtPos = new THREE.Vector3(0, 1.5, tmpObj.targetFarDist);
		tobj.endPos = new THREE.Vector3(0, 1.5, tmpObj.targetFarDist);
		tobj.mesh = new THREE.Mesh(targetPunchGeometry, targetMaterialA);
		tobj.mesh.position.set(0, 0, tmpObj.targetFarDist);
		tobj.rotationRate = 0.01;
		tobj.strtTime = tmpObj.utimeStrt;
		tobj.endTime = tmpObj.utimeEnd;
		tobj.timeEnabled = false;
		tobj.audioDefined = false;
		tobj.audioPlay = false;
		tobj.collided = false;
		scene.add(tobj.mesh);
	}

	tmpObj.targetsPunchB = [];
	for (let cnt = parseInt(0); cnt < tmpObj.maxTargets; cnt++) {
		tmpObj.targetsPunchB[cnt] = {};
		const tobj = tmpObj.targetsPunchB[cnt];
		tobj.strtPos = new THREE.Vector3(0, 1.5, tmpObj.targetFarDist);
		tobj.endPos = new THREE.Vector3(0, 1.5, tmpObj.targetFarDist);
		tobj.mesh = new THREE.Mesh(targetPunchGeometry, targetMaterialB);
		tobj.mesh.position.set(0, 0, tmpObj.targetFarDist);
		tobj.rotationRate = 0.01;
		tobj.strtTime = tmpObj.utimeStrt;
		tobj.endTime = tmpObj.utimeEnd;
		tobj.timeEnabled = false;
		tobj.audioDefined = false;
		tobj.audioPlay = false;
		tobj.collided = false;
		scene.add(tobj.mesh);
	}

	tmpObj.targetsKickA = [];
	for (let cnt = parseInt(0); cnt < tmpObj.maxTargets; cnt++) {
		tmpObj.targetsKickA[cnt] = {};

	marker1 = new THREE.Mesh(marker1Geometry, markerMaterial);
	marker1.position.set(-0, 0, 0);
	scene.add(marker1);
		const tobj = tmpObj.targetsKickA[cnt];
		tobj.strtPos = new THREE.Vector3(0, 1.5, tmpObj.targetFarDist);
		tobj.endPos = new THREE.Vector3(0, 1.5, tmpObj.targetFarDist);
		tobj.mesh = new THREE.Mesh(targetKickGeometry, targetMaterialA);
		tobj.mesh.position.set(0, 0, tmpObj.targetFarDist);
		tobj.rotationRate = 0.01;
		tobj.strtTime = tmpObj.utimeStrt;
		tobj.endTime = tmpObj.utimeEnd;
		tobj.timeEnabled = false;
		tobj.audioDefined = false;
		tobj.audioPlay = false;
		tobj.collided = false;
		scene.add(tobj.mesh);
	}

	tmpObj.targetsKickB = [];
	for (let cnt = parseInt(0); cnt < tmpObj.maxTargets; cnt++) {
		tmpObj.targetsKickB[cnt] = {};
		const tobj = tmpObj.targetsKickB[cnt];
		tobj.strtPos = new THREE.Vector3(0, 1.5, tmpObj.targetFarDist);
		tobj.endPos = new THREE.Vector3(0, 1.5, tmpObj.targetFarDist);
		tobj.mesh = new THREE.Mesh(targetKickGeometry, targetMaterialB);
		tobj.mesh.position.set(0, 0, tmpObj.targetFarDist);
		tobj.rotationRate = 0.01;
		tobj.strtTime = tmpObj.utimeStrt;
		tobj.endTime = tmpObj.utimeEnd;
		tobj.timeEnabled = false;
		tobj.audioDefined = false;
		tobj.audioPlay = false;
		tobj.collided = false;
		scene.add(tobj.mesh);
	}

	tmpObj.dumbbelsA = [];
	for (let cnt = parseInt(0); cnt < tmpObj.maxDumbbels; cnt++) {
		tmpObj.dumbbelsA[cnt] = {};
		const tobj = tmpObj.dumbbelsA[cnt];
		tobj.strtPos = new THREE.Vector3(0, 1.5, tmpObj.targetFarDist);
		tobj.endPos = new THREE.Vector3(0, 1.5, tmpObj.targetFarDist);
		tobj.mesh = new THREE.Mesh(dumbbellGeometry, dumbbellMaterialA);
		tobj.mesh.position.set(0, 0, tmpObj.targetFarDist);
		tobj.rotationRate = 0.01;
		tobj.strtTime = tmpObj.utimeStrt;
		tobj.endTime = tmpObj.utimeEnd;
		tobj.timeEnabled = false;
		tobj.audioDefined = false;
		tobj.audioPlay = false;
		tobj.collided = false;
		scene.add(tobj.mesh);
	}

	tmpObj.jumpHurdlesA = [];
	for (let cnt = parseInt(0); cnt < tmpObj.maxJumpHurdles; cnt++) {
		tmpObj.jumpHurdlesA[cnt] = {};
		const tobj = tmpObj.jumpHurdlesA[cnt];
		tobj.strtPos = new THREE.Vector3(0, 1.5, tmpObj.targetFarDist);
		tobj.endPos = new THREE.Vector3(0, 1.5, tmpObj.targetFarDist);
		tobj.mesh = new THREE.Mesh(jumpHurdleGeometry, jumpHurdleMaterialA);
		tobj.mesh.position.set(0, 0, tmpObj.targetFarDist);
		tobj.rotationRate = 0.01;
		tobj.strtTime = tmpObj.utimeStrt;
		tobj.endTime = tmpObj.utimeEnd;
		tobj.timeEnabled = false;
		tobj.audioDefined = false;
		tobj.audioPlay = false;
		tobj.collided = false;
		scene.add(tobj.mesh);
	}



	tmpObj.stTimeA = parseInt(-5);

	tmpObj.stTimeB = parseInt(-5);


	// const controller0 = gl.xr.getController(0);
	const controllerGrip0 = gl.xr.getControllerGrip(0);

	// const controller1 = gl.xr.getController(1);
	const controllerGrip1 = gl.xr.getControllerGrip(1);


	tmpObj.controllerSize = 0.1;

	const controllerGeometry = new THREE.BoxGeometry(
		tmpObj.controllerSize,
		tmpObj.controllerSize,
		tmpObj.controllerSize
	);

	const controllerMaterial0 = new THREE.MeshPhongMaterial({
		color: 0xff0000
	});

	const controllerMaterial1 = new THREE.MeshPhongMaterial({
		color: 0x00ff00
	});

	tmpObj.controllerMesh0 = new THREE.Mesh(controllerGeometry, controllerMaterial0);
	tmpObj.controllerMesh0.position.set(0, 0, 0.1);

	tmpObj.controllerMesh1 = new THREE.Mesh(controllerGeometry, controllerMaterial1);
	tmpObj.controllerMesh1.position.set(0, 0, 0.1);


	controllerGrip0.add(tmpObj.controllerMesh0);
	scene.add(controllerGrip0);

	controllerGrip1.add(tmpObj.controllerMesh1);
	scene.add(controllerGrip1);



	const plane = new THREE.Mesh(planeGeometry, planeMaterial);
	plane.rotation.x = Math.PI / 2;
	//scene.add(plane);

	tmpObj.textMesh = null;


	fontLoader.load('./fonts/helvetiker_bold.typeface.json', function(afont) {

		tmpObj.font = afont;

		{

			const fntMultiplier = tmpObj.masterFontSizeMultiplier;
			const fntSz = 50 * fntMultiplier;
			const fntHt = 10 * fntMultiplier;
			const bvlThk = 1 * fntMultiplier;
			const bvlSz = 1 * fntMultiplier;

			tmpObj.textGeo = new THREE.TextGeometry('SMASH.BOX', {

				font: tmpObj.font,

				size: fntSz,
				height: fntHt,
				curveSegments: 12,

				bevelThickness: bvlThk,
				bevelSize: bvlSz,
				bevelEnabled: true

			});

		}


		tmpObj.textGeo.computeBoundingBox();
		const centerOffsetX = - 0.5 * (tmpObj.textGeo.boundingBox.max.x + tmpObj.textGeo.boundingBox.min.x);

		tmpObj.textMesh = new THREE.Mesh(tmpObj.textGeo, tmpObj.textMaterial);
		tmpObj.textMesh.position.x = centerOffsetX;
		tmpObj.textMesh.position.y = bucketL2Height + 0.5;
		tmpObj.textMesh.position.z = tmpObj.backDistBucket;

		tmpObj.textMesh.castShadow = true;
		tmpObj.textMesh.receiveShadow = true;

		scene.add(tmpObj.textMesh);
	});





	// create objects when audio buffer is loaded

	tmpObj.audioLoader.load('sounds/SmashBoxClip.mp3', function(buffer) {


		console.log("Have Buffer!!!!!!!!!!!!!!!!");

		tmpObj.audioBuffer = buffer;


		for (let cnt = parseInt(0); cnt < tmpObj.maxTargets; cnt++) {
			const tobj = tmpObj.targetsPunchA[cnt];
			const audio = new THREE.PositionalAudio(tmpObj.audioListener);
			audio.setBuffer(tmpObj.audioBuffer);
			tobj.mesh.add(audio);
			tobj.audioDefined = true;
		}

		for (let cnt = parseInt(0); cnt < tmpObj.maxTargets; cnt++) {
			const tobj = tmpObj.targetsPunchB[cnt];
			const audio = new THREE.PositionalAudio(tmpObj.audioListener);
			audio.setBuffer(tmpObj.audioBuffer);
			tobj.mesh.add(audio);
			tobj.audioDefined = true;
		}

		for (let cnt = parseInt(0); cnt < tmpObj.maxTargets; cnt++) {
			const tobj = tmpObj.targetsKickA[cnt];
			const audio = new THREE.PositionalAudio(tmpObj.audioListener);
			audio.setBuffer(tmpObj.audioBuffer);
			tobj.mesh.add(audio);
			tobj.audioDefined = true;
		}

		for (let cnt = parseInt(0); cnt < tmpObj.maxTargets; cnt++) {
			const tobj = tmpObj.targetsKickB[cnt];
			const audio = new THREE.PositionalAudio(tmpObj.audioListener);
			audio.setBuffer(tmpObj.audioBuffer);
			tobj.mesh.add(audio);
			tobj.audioDefined = true;
		}

		for (let cnt = parseInt(0); cnt < tmpObj.maxDumbbels; cnt++) {
			const tobj = tmpObj.dumbbelsA[cnt];
			const audio = new THREE.PositionalAudio(tmpObj.audioListener);
			audio.setBuffer(tmpObj.audioBuffer);
			tobj.mesh.add(audio);
			tobj.audioDefined = true;
		}

		for (let cnt = parseInt(0); cnt < tmpObj.maxJumpHurdles; cnt++) {
			const tobj = tmpObj.jumpHurdlesA[cnt];
			const audio = new THREE.PositionalAudio(tmpObj.audioListener);
			audio.setBuffer(tmpObj.audioBuffer);
			tobj.mesh.add(audio);
			tobj.audioDefined = true;
		}



	});




	//LIGHTS
	const color = 0xffffff;
	const intensity = .7;
	light = new THREE.DirectionalLight(color, intensity);
	light.target = plane;
	light.position.set(0, 30, 30);
	scene.add(light);
	scene.add(light.target);

	const ambientColor = 0xffffff;
	const ambientIntensity = 0.2;
	const ambientLight = new THREE.AmbientLight(ambientColor, ambientIntensity);
	scene.add(ambientLight);





	tmpObj.dumbbellStrategy = new DumbbellStrategy();

	tmpObj.jumpHurdleStrategy = new JumpHurdleStrategy();

	tmpObj.rightUppercutStrategy = new RightUppercutStrategy();

	tmpObj.leftUppercutStrategy = new LeftUppercutStrategy();

	tmpObj.rightHookHeadStrategy = new RightHookHeadStrategy();

	tmpObj.leftHookHeadStrategy = new LeftHookHeadStrategy();

	tmpObj.rightHammerStrikeStrategy = new RightHammerStrikeStrategy();

	tmpObj.leftHammerStrikeStrategy = new LeftHammerStrikeStrategy();

	tmpObj.rightFrontKickAbdomenStrategy = new RightFrontKickAbdomenStrategy();

	tmpObj.leftFrontKickAbdomenStrategy = new LeftFrontKickAbdomenStrategy();
	
	tmpObj.rightRoundhouseKickStrategy = new RightRoundhouseKickStrategy();

	tmpObj.leftRoundhouseKickStrategy = new LeftRoundhouseKickStrategy();
	
	tmpObj.rightUppercutJumpStrategy = new RightUppercutJumpStrategy();
	
	tmpObj.leftUppercutJumpStrategy = new LeftUppercutJumpStrategy();
	
	tmpObj.rightSideBladeKickAbdomenStrategy = new RightSideBladeKickAbdomenStrategy();
	
	tmpObj.leftSideBladeKickAbdomenStrategy = new LeftSideBladeKickAbdomenStrategy();
	
	tmpObj.rightSideBladeKickTrainAbdomenStrategy = new RightSideBladeKickTrainAbdomenStrategy();
	
	tmpObj.leftSideBladeKickTrainAbdomenStrategy = new LeftSideBladeKickTrainAbdomenStrategy();
	
	tmpObj.rightStraightAbdomenStrategy = new RightStraightAbdomenStrategy();
	
	tmpObj.leftStraightAbdomenStrategy = new LeftStraightAbdomenStrategy();





	tmpObj.strategiesOffense = [];

	tmpObj.strategiesDefense = [];



	tmpObj.strategiesOffenseHeadA = [];

	tmpObj.strategiesOffenseHeadA[0] = tmpObj.rightHookHeadStrategy;

	tmpObj.strategiesOffenseHeadA[1] = tmpObj.leftHookHeadStrategy;

	tmpObj.strategiesOffenseHeadA[2] = tmpObj.rightUppercutStrategy;

	tmpObj.strategiesOffenseHeadA[3] = tmpObj.leftUppercutStrategy;

	tmpObj.strategiesOffenseHeadA[4] = tmpObj.rightUppercutJumpStrategy;

	tmpObj.strategiesOffenseHeadA[5] = tmpObj.leftUppercutJumpStrategy;

	tmpObj.strategiesOffenseHeadA[6] = tmpObj.leftHammerStrikeStrategy;

	tmpObj.strategiesOffenseHeadA[7] = tmpObj.rightHammerStrikeStrategy;




	tmpObj.strategiesOffenseHeadB = [];

	tmpObj.strategiesOffenseHeadB[0] = tmpObj.rightUppercutStrategy;

	tmpObj.strategiesOffenseHeadB[1] = tmpObj.leftUppercutStrategy;

	tmpObj.strategiesOffenseHeadB[2] = tmpObj.rightUppercutJumpStrategy;

	tmpObj.strategiesOffenseHeadB[3] = tmpObj.leftUppercutJumpStrategy;




	tmpObj.strategiesOffenseSolarplex = [];

	tmpObj.strategiesOffenseSolarplex[0] = new RightStraightSolarplexStrategy();

	tmpObj.strategiesOffenseSolarplex[1] = new LeftStraightSolarplexStrategy();




	tmpObj.strategiesOffenseAbdomen = [];

	tmpObj.strategiesOffenseAbdomen[0] = tmpObj.rightFrontKickAbdomenStrategy;

	tmpObj.strategiesOffenseAbdomen[1] = tmpObj.leftFrontKickAbdomenStrategy;

	tmpObj.strategiesOffenseAbdomen[2] = new RightHookAbdomenStrategy();

	tmpObj.strategiesOffenseAbdomen[3] = new LeftHookAbdomenStrategy();

	tmpObj.strategiesOffenseAbdomen[4] = tmpObj.rightRoundhouseKickStrategy;

	tmpObj.strategiesOffenseAbdomen[5] = tmpObj.leftRoundhouseKickStrategy;

	tmpObj.strategiesOffenseAbdomen[6] = new RightFrontKickThenRoundhouseStrategy();

	tmpObj.strategiesOffenseAbdomen[7] = new LeftFrontKickThenRoundhouseStrategy();

	tmpObj.strategiesOffenseAbdomen[8] = new RightPunchDownJumpStrategy();

	tmpObj.strategiesOffenseAbdomen[9] = new LeftPunchDownJumpStrategy();

	tmpObj.strategiesOffenseAbdomen[10] = tmpObj.rightStraightAbdomenStrategy;

	tmpObj.strategiesOffenseAbdomen[11] = tmpObj.leftStraightAbdomenStrategy;

	tmpObj.strategiesOffenseAbdomen[12] = new RightStraightBodyTrainStrategy();

	tmpObj.strategiesOffenseAbdomen[13] = new LeftStraightBodyTrainStrategy();

	tmpObj.strategiesOffenseAbdomen[14] = tmpObj.rightSideBladeKickAbdomenStrategy;

	tmpObj.strategiesOffenseAbdomen[15] = tmpObj.leftSideBladeKickAbdomenStrategy;

	tmpObj.strategiesOffenseAbdomen[16] = tmpObj.rightSideBladeKickTrainAbdomenStrategy;

	tmpObj.strategiesOffenseAbdomen[17] = tmpObj.leftSideBladeKickTrainAbdomenStrategy;




	tmpObj.strategiesOffenseLegMid = [];

	tmpObj.strategiesOffenseLegMid[0] = new RightPushKickStrategy();

	tmpObj.strategiesOffenseLegMid[1] = new LeftPushKickStrategy();

	tmpObj.strategiesOffenseLegMid[2] = new RightFrontKickLegStrategy();

	tmpObj.strategiesOffenseLegMid[3] = new LeftFrontKickLegStrategy();

	tmpObj.strategiesOffenseLegMid[4] = new ParallelHopsStrategy();




	tmpObj.strategiesOffenseLegRight = [];

	tmpObj.strategiesOffenseLegRight[0] = new RightSideBladeKickLegStrategy();




	tmpObj.strategiesOffenseLegLeft = [];

	tmpObj.strategiesOffenseLegLeft[0] = new LeftSideBladeKickLegStrategy();




	tmpObj.strategiesOffenseLeg = [];

	tmpObj.strategiesOffenseLeg[0] = new OffenseLegStrategy();







	tmpObj.strategiesOffense[0] = tmpObj.strategiesOffenseHeadA;

	tmpObj.strategiesOffense[1] = tmpObj.strategiesOffenseSolarplex;

	tmpObj.strategiesOffense[2] = tmpObj.strategiesOffenseAbdomen

	tmpObj.strategiesOffense[3] = tmpObj.strategiesOffenseLeg;








	tmpObj.strategiesDefense[0] = tmpObj.dumbbellStrategy;

	tmpObj.strategiesDefense[1] = new RandomStrategy();

	tmpObj.strategiesDefense[2] = new ProtectGuardStrategy();

	tmpObj.strategiesDefense[3] = new LeftOccupyStrategy();

	tmpObj.strategiesDefense[4] = new RightOccupyStrategy();

	tmpObj.strategiesDefense[5] = new TripleLeftOccupyStrategy();

	tmpObj.strategiesDefense[6] = new TripleRightOccupyStrategy();

	tmpObj.strategiesDefense[7] = tmpObj.jumpHurdleStrategy;

	tmpObj.strategiesDefense[8] = new QuadRoundStrategy();

	tmpObj.strategiesDefense[9] = new ProtectHammerStrikeStrategy();




	tmpObj.now = performance.now();
	tmpObj.curSecs = -5;

} // init




// Handles the processing of the current audio context.
function processAudioCtx(tmpObj) {
	if (tmpObj.audioCtx == undefined) {
		tmpObj.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
	}
	else {
		const astate = tmpObj.audioCtx.state;
		if (astate != "running") {
			tmpObj.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
		}
		else {
			// console.log( "Skippy Skip!!!!!!!!!!!" );
		}
	}
} // processAudioCtx







// Enables the positional audio on a tobj indicating a collision.
function enableColisionSound(tmpObj, tobj) {
	tobj.timeEnabled = true;
	if (tobj.audioDefined) {
		const audio = tobj.mesh.children[0];
		if (audio.isPlaying) {
			audio.stop();
		}
		// audio.isPlaying = false;
		tobj.audioPlay = true;
	}
} // enableColisionSound







// Performs the playing of positional audio on a tobj indicating a collision.
function processTobjAudioPlay(tmpObj, tobj) {
	if (tobj.audioPlay) {
		processAudioCtx(tmpObj);
		const audio = tobj.mesh.children[0];
		audio.context = tmpObj.audioCtx;
		audio.panner = audio.context.createPanner();
		audio.panner.panningModel = 'HRTF';
		//		audio.play(); // play audio upon leaving bucket
		const audioCtx = tmpObj.audioCtx;
		if (audioCtx != undefined) {
			const source = audioCtx.createBufferSource();
			source.buffer = tmpObj.audioBuffer;
			audio.setBuffer(tmpObj.audioBuffer);
			audio.panner.connect(audioCtx.destination);
			// audio.setNodeSource( source );
			// console.log( tmpObj.audioBuffer );
			// source.connect(audioCtx.destination);
			source.connect(audio.panner);
			source.start();
		}
	}
	tobj.audioPlay = false;
} // processTobjAudioPlay







// Checks whether a dumbbell has collided with a cylinder under the player view.
// NOTE: The algorithm used for collision checking is fairly dumb.
function checkDumbbellCollision(tmpObj, tobj) {
	// if tmpObj.realCamera != tmpObj.camera then VR is being processed.
	if (!(tobj.collided) /* && ( tmpObj.realCamera != tmpObj.camera ) */) {
		const cameraPos = new THREE.Vector3();
		tmpObj.realCamera.getWorldPosition(cameraPos);
		const dumbbellPos = tobj.mesh.position;
		// Dumbbell size plus viewer head size
		const sizeConstraint = tmpObj.dumbbellSize * 0.5 + (0.15 * 0.5);

		const collidedX = Math.abs(dumbbellPos.x - cameraPos.x) <= sizeConstraint;

		const collidedY = dumbbellPos.y <= (cameraPos.y + 0.03);

		const collidedZ = Math.abs(dumbbellPos.z - cameraPos.z) <= sizeConstraint;

		const collided = collidedX && collidedY && collidedZ;
		if (collided) {
			enableColisionSound(tmpObj, tobj);
			tmpObj.dumbbellHits = parseInt(tmpObj.dumbbellHits + 1);
			tobj.collided = true;
		}
	}
} // checkDumbbellCollision





// Checks whether a controller has punched the correct target.
// NOTE: The algorithm used for collision checking is fairly dumb.
function checkControllerCollision(tmpObj, controllerMesh, tobj) {
	var collided = false;
	// if tmpObj.realCamera != tmpObj.camera then VR is being processed.
	if (!(tobj.collided) /* && ( tmpObj.realCamera != tmpObj.camera ) */) {
		const controllerPos = new THREE.Vector3();
		controllerMesh.getWorldPosition(controllerPos);
		const targetPos = tobj.mesh.position;

		const sizeConstraint = (tmpObj.controllerSize) * 0.5 + (tmpObj.targetPunchSize) * 0.5;

		const collidedX = Math.abs(targetPos.x - controllerPos.x) <= sizeConstraint;

		const collidedY = Math.abs(targetPos.y - controllerPos.y) <= sizeConstraint;

		const collidedZ = Math.abs(targetPos.z - controllerPos.z) <= sizeConstraint;

		collided = collidedX && collidedY && collidedZ;
		if (collided) {
			enableColisionSound(tmpObj, tobj);
			tobj.collided = true;
		}
	}
	return collided;
} // checkControllerCollision




// Sets the animation of the display.
function animate() {
	gl.setAnimationLoop(draw);
} // animate



// "Draws" the contents of the display.
function draw(time) {
	time *= 0.001;

	if (resizeDisplay) {
		tmpObj.camera.aspect = window.innerWidth / window.innerHeight;
		tmpObj.camera.updateProjectionMatrix();
	}

	cube.rotation.x += 0.01;
	cube.rotation.y += 0.01;
	cube.rotation.z += 0.01;




	const now = parseInt(performance.now());
	const curSecs = parseInt(now / 1000);


	if (now > tmpObj.endTime) {
		if (tmpObj.endTime < -3000) {
			tmpObj.endTime = now;
		}
		
		

	    {
	        var difficulty = parseFloat( tmpObj.difficultyText.value );
	        console.log( tmpObj.difficultyText );
	        console.log( tmpObj.difficultyText.value );
	        console.log( difficulty );
	        if( isNaN( difficulty ) )
	        {
	            difficulty = 50;
	        }
	        if( difficulty < 2 )
	        {
	            difficulty = 2;
	        }
	        tmpObj.referenceTimeSplit = parseInt( ( difficulty / 50.0 ) * 250 / 2.1);
	        tmpObj.randomStrategyTimeSplit = parseInt( ( difficulty / 50.0 ) * 500 / 2);
		    const split2 = tmpObj.referenceTimeSplit;
		    tmpObj.flightTime = parseInt(split2 * 5 * 1.6);
		    tmpObj.flightTimeKick = parseInt(split2 * 5 * 1.6 * 1.2);
		    tmpObj.flightTimeStraightPunch = parseInt(split2 * 5 * 1.6 * 0.8);
		    tmpObj.flightTimeDumbbell = parseInt(split2 * 5 * 1.6 * 0.8);
		    tmpObj.jumpingKickDelay = 1.5 * split2;
	    }


		const INCHES_TO_CENTIMETERS = 2.54;
		const CENTIMETERS_TO_METERS = 0.01;
		const FEET_TO_INCHES = 12;
		
		var heightFeet = parseInt( tmpObj.playerHeightFeetText.value );
		
		if( isNaN( heightFeet ) )
		{
		    heightFeet = 1;
		}
		
		var heightInches = parseInt( tmpObj.playerHeightInchesText.value );
		
		if( isNaN( heightInches ) )
		{
		    heightInches = 0;
		}

		tmpObj.defenseHeight = (heightFeet * FEET_TO_INCHES + heightInches) * INCHES_TO_CENTIMETERS * CENTIMETERS_TO_METERS;

		const deltaHeight = 6 * INCHES_TO_CENTIMETERS * CENTIMETERS_TO_METERS * Math.random();

		tmpObj.offenseHeight = tmpObj.defenseHeight + (Math.random() < 0.5 ? -deltaHeight : deltaHeight);

		if (tmpObj.nextSequence != null) {
			const tobj = tmpObj.nextSequence;
			tmpObj.nextSequence = null;
			tobj.init(tmpObj, tmpObj.endTime);
		}
		else {
			if (Math.random() < 0.5) {
				if ((tmpObj.offenseHeight - tmpObj.defenseHeight) > (2 * INCHES_TO_CENTIMETERS * CENTIMETERS_TO_METERS)) {
					tmpObj.strategiesOffense[0] = tmpObj.strategiesOffenseHeadB;
				}
				else {
					tmpObj.strategiesOffense[0] = tmpObj.strategiesOffenseHeadA;
				}

				var randn = parseInt(Math.floor(Math.random() * tmpObj.strategiesOffense.length));

				const rr = tmpObj.strategiesOffense[randn];

				randn = parseInt(Math.floor(Math.random() * rr.length));

				rr[randn].init(tmpObj, tmpObj.endTime);
			}
			else {
				var randn = parseInt(Math.floor(Math.random() * tmpObj.strategiesDefense.length));

				tmpObj.strategiesDefense[randn].init(tmpObj, tmpObj.endTime);
			}
			// ( new LeftSideBladeKickTrainAbdomenStrategy() ).init( tmpObj , tmpObj.endTime );
		}


	}




	for (let cnt = parseInt(0); cnt < tmpObj.maxTargets; cnt++) {
		const tobj = tmpObj.targetsPunchA[cnt];
		const uA = (now - tobj.strtTime) / (tobj.endTime - tobj.strtTime);
		if ((uA >= 0.0) && (uA <= 1.0)) {
			tobj.mesh.rotation.x += tobj.rotationRate;
			tobj.mesh.rotation.y += tobj.rotationRate;
			tobj.mesh.rotation.z += tobj.rotationRate;

			tobj.mesh.position.set(
				(1 - uA) * (tobj.strtPos.x) + uA * (tobj.endPos.x),
				(1 - uA) * (tobj.strtPos.y) + uA * (tobj.endPos.y),
				(1 - uA) * (tobj.strtPos.z) + uA * (tobj.endPos.z)
			);
			var collided = checkControllerCollision(tmpObj, tmpObj.controllerMesh0, tobj);
			if (collided) {
				tmpObj.rightPunchHits = parseInt(tmpObj.rightPunchHits + 1);
			}
			processTobjAudioPlay(tmpObj, tobj);
		}
		else if ((uA > 1.0) && (tobj.timeEnabled)) {
			tobj.strtTime = tmpObj.utimeStrt;
			tobj.endTime = tmpObj.utimeEnd;
			tobj.timeEnabled = false;
			tobj.strtPos.set(0, 1.5, tmpObj.targetFarDist);
			tobj.endPos.set(0, 1.5, tmpObj.targetFarDist);
			tobj.mesh.position.set(0, 0, tmpObj.targetFarDist);
		}
	}

	for (let cnt = parseInt(0); cnt < tmpObj.maxTargets; cnt++) {
		const tobj = tmpObj.targetsPunchB[cnt];
		const uB = (now - tobj.strtTime) / (tobj.endTime - tobj.strtTime);
		if ((uB >= 0.0) && (uB <= 1.0)) {
			tobj.mesh.rotation.x += tobj.rotationRate;
			tobj.mesh.rotation.y += tobj.rotationRate;
			tobj.mesh.rotation.z += tobj.rotationRate;

			tobj.mesh.position.set(
				(1 - uB) * (tobj.strtPos.x) + uB * (tobj.endPos.x),
				(1 - uB) * (tobj.strtPos.y) + uB * (tobj.endPos.y),
				(1 - uB) * (tobj.strtPos.z) + uB * (tobj.endPos.z)
			);
			var collided = checkControllerCollision(tmpObj, tmpObj.controllerMesh1, tobj);
			if (collided) {
				tmpObj.leftPunchHits = parseInt(tmpObj.leftPunchHits + 1);
			}
			processTobjAudioPlay(tmpObj, tobj);
		}
		else if ((uB > 1.0) && (tobj.timeEnabled)) {
			tobj.strtTime = tmpObj.utimeStrt;
			tobj.endTime = tmpObj.utimeEnd;
			tobj.timeEnabled = false;
			tobj.strtPos.set(0, 1.5, tmpObj.targetFarDist);
			tobj.endPos.set(0, 1.5, tmpObj.targetFarDist);
			tobj.mesh.position.set(0, 0, tmpObj.targetFarDist);
		}
	}

	for (let cnt = parseInt(0); cnt < tmpObj.maxTargets; cnt++) {
		const tobj = tmpObj.targetsKickA[cnt];
		const uA = (now - tobj.strtTime) / (tobj.endTime - tobj.strtTime);
		if ((uA >= 0.0) && (uA <= 1.0)) {
			tobj.mesh.rotation.x += tobj.rotationRate;
			tobj.mesh.rotation.y += tobj.rotationRate;
			tobj.mesh.rotation.z += tobj.rotationRate;

			tobj.mesh.position.set(
				(1 - uA) * (tobj.strtPos.x) + uA * (tobj.endPos.x),
				(1 - uA) * (tobj.strtPos.y) + uA * (tobj.endPos.y),
				(1 - uA) * (tobj.strtPos.z) + uA * (tobj.endPos.z)
			);
			processTobjAudioPlay(tmpObj, tobj);
		}
		else if ((uA > 1.0) && (tobj.timeEnabled)) {
			tobj.strtTime = tmpObj.utimeStrt;
			tobj.endTime = tmpObj.utimeEnd;
			tobj.timeEnabled = false;
			tobj.strtPos.set(0, 1.5, tmpObj.targetFarDist);
			tobj.endPos.set(0, 1.5, tmpObj.targetFarDist);
			tobj.mesh.position.set(0, 0, tmpObj.targetFarDist);
		}
	}

	for (let cnt = parseInt(0); cnt < tmpObj.maxTargets; cnt++) {
		const tobj = tmpObj.targetsKickB[cnt];
		const uB = (now - tobj.strtTime) / (tobj.endTime - tobj.strtTime);
		if ((uB >= 0.0) && (uB <= 1.0)) {
			tobj.mesh.rotation.x += tobj.rotationRate;
			tobj.mesh.rotation.y += tobj.rotationRate;
			tobj.mesh.rotation.z += tobj.rotationRate;

			tobj.mesh.position.set(
				(1 - uB) * (tobj.strtPos.x) + uB * (tobj.endPos.x),
				(1 - uB) * (tobj.strtPos.y) + uB * (tobj.endPos.y),
				(1 - uB) * (tobj.strtPos.z) + uB * (tobj.endPos.z)
			);
			processTobjAudioPlay(tmpObj, tobj);
		}
		else if ((uB > 1.0) && (tobj.timeEnabled)) {
			tobj.strtTime = tmpObj.utimeStrt;
			tobj.endTime = tmpObj.utimeEnd;
			tobj.timeEnabled = false;
			tobj.strtPos.set(0, 1.5, tmpObj.targetFarDist);
			tobj.endPos.set(0, 1.5, tmpObj.targetFarDist);
			tobj.mesh.position.set(0, 0, tmpObj.targetFarDist);
		}
	}

	for (let cnt = parseInt(0); cnt < tmpObj.maxDumbbels; cnt++) {
		const tobj = tmpObj.dumbbelsA[cnt];
		const uB = (now - tobj.strtTime) / (tobj.endTime - tobj.strtTime);
		if ((uB >= 0.0) && (uB <= 1.0)) {
			tobj.mesh.rotation.x += tobj.rotationRate;
			tobj.mesh.rotation.y += tobj.rotationRate;
			tobj.mesh.rotation.z += tobj.rotationRate;

			tobj.mesh.position.set(
				(1 - uB) * (tobj.strtPos.x) + uB * (tobj.endPos.x),
				(1 - uB) * (tobj.strtPos.y) + uB * (tobj.endPos.y),
				(1 - uB) * (tobj.strtPos.z) + uB * (tobj.endPos.z)
			);
			checkDumbbellCollision(tmpObj, tobj);
			processTobjAudioPlay(tmpObj, tobj);
		}
		else if ((uB > 1.0) && (tobj.timeEnabled)) {
			tobj.strtTime = tmpObj.utimeStrt;
			tobj.endTime = tmpObj.utimeEnd;
			tobj.timeEnabled = false;
			tobj.strtPos.set(0, 1.5, tmpObj.targetFarDist);
			tobj.endPos.set(0, 1.5, tmpObj.targetFarDist);
			tobj.mesh.position.set(0, 0, tmpObj.targetFarDist);
		}
	}

	for (let cnt = parseInt(0); cnt < tmpObj.maxJumpHurdles; cnt++) {
		const tobj = tmpObj.jumpHurdlesA[cnt];
		const uB = (now - tobj.strtTime) / (tobj.endTime - tobj.strtTime);
		if ((uB >= 0.0) && (uB <= 1.0)) {
			// Jump Hurdles Do Not Rotate

			tobj.mesh.position.set(
				(1 - uB) * (tobj.strtPos.x) + uB * (tobj.endPos.x),
				(1 - uB) * (tobj.strtPos.y) + uB * (tobj.endPos.y),
				(1 - uB) * (tobj.strtPos.z) + uB * (tobj.endPos.z)
			);
			processTobjAudioPlay(tmpObj, tobj);
		}
		else if ((uB > 1.0) && (tobj.timeEnabled)) {
			tobj.strtTime = tmpObj.utimeStrt;
			tobj.endTime = tmpObj.utimeEnd;
			tobj.timeEnabled = false;
			tobj.strtPos.set(0, 1.5, tmpObj.targetFarDist);
			tobj.endPos.set(0, 1.5, tmpObj.targetFarDist);
			tobj.mesh.position.set(0, 0, tmpObj.targetFarDist);
		}
	}



	light.position.x = 20 * Math.cos(time);
	light.position.y = 20 * Math.sin(time);



	var secsChanged = ((curSecs - tmpObj.curSecs) > 0);
	var updateDumbbellHits = tmpObj.updateDumbbellHits;
	var updateLeftPunchHits = tmpObj.updateLeftPunchHits;
	var updateRightPunchHits = tmpObj.updateRightPunchHits;


	// console.log( tmpObj );
	if (secsChanged && (tmpObj.textMesh !== null)) {

		// console.log( tmpObj );
		// console.log( tmpObj.font );
		// console.log( tmpObj.textMesh );



		const fntMultiplier = tmpObj.masterFontSizeMultiplier;
		const fntSz = 50 * fntMultiplier;
		const fntHt = 10 * fntMultiplier;
		const bvlThk = 1 * fntMultiplier;
		const bvlSz = 1 * fntMultiplier;

		const stringSeconds = String(parseInt(curSecs % 60)).padStart(2, '0');
		const stringMinutes = String(parseInt(curSecs / 60)).padStart(3, '0');
		const displayString = stringMinutes + ':' + stringSeconds;

		const prevTextGeo = tmpObj.textGeo;

		tmpObj.textGeo = new THREE.TextGeometry(displayString, {

			font: tmpObj.font,

			size: fntSz,
			height: fntHt,
			curveSegments: 12,

			bevelThickness: bvlThk,
			bevelSize: bvlSz,
			bevelEnabled: true

		});

		tmpObj.textGeo.computeBoundingBox();
		const centerOffsetX = - 0.5 * (tmpObj.textGeo.boundingBox.max.x + tmpObj.textGeo.boundingBox.min.x);

		const bucketL2Height = 3;

		const prevTextMesh = tmpObj.textMesh;

		scene.remove(prevTextMesh);

		tmpObj.textMesh = new THREE.Mesh(tmpObj.textGeo, tmpObj.textMaterial);
		tmpObj.textMesh.position.x = centerOffsetX;
		tmpObj.textMesh.position.y = bucketL2Height + 0.5;
		tmpObj.textMesh.position.z = tmpObj.backDistBucket;

		tmpObj.textMesh.castShadow = true;
		tmpObj.textMesh.receiveShadow = true;

		scene.add(tmpObj.textMesh);

		prevTextGeo.dispose();


		tmpObj.updateDumbbellHits = true;
		tmpObj.updateLeftPunchHits = true;
		tmpObj.updateRightPunchHits = true;
		updateDumbbellHits = false;
		updateLeftPunchHits = false;
		updateRightPunchHits = false;

	}


	if ((tmpObj.dumbbellHits != tmpObj.prevDumbbellHits) && updateDumbbellHits) {

		const displayString = '' + (tmpObj.dumbbellHits);
		tmpObj.dumbbellHitText.value = displayString;

		tmpObj.prevDumbbellHits = tmpObj.dumbbellHits;


		updateDumbbellHits = false;
		updateLeftPunchHits = false;
		updateRightPunchHits = false;
		tmpObj.updateDumbbellHits = false;

	}


	if ((tmpObj.rightPunchHits != tmpObj.prevRightPunchHits) && updateRightPunchHits) {

		const displayString = '' + (tmpObj.rightPunchHits);
        tmpObj.rightPunchText.value = displayString;
		
        tmpObj.prevRightPunchHits = tmpObj.rightPunchHits;

		updateDumbbellHits = false;
		updateLeftPunchHits = false;
		updateRightPunchHits = false;
		tmpObj.updateRightPunchHits = false;

	}


	if ((tmpObj.leftPunchHits != tmpObj.prevLeftPunchHits) && updateLeftPunchHits) {

		const displayString = '' + (tmpObj.leftPunchHits);
		tmpObj.leftPunchText.value = displayString;

		tmpObj.prevLeftPunchHits = tmpObj.leftPunchHits;

		updateDumbbellHits = false;
		updateLeftPunchHits = false;
		updateRightPunchHits = false;
		tmpObj.updateLeftPunchHits = false;

	}


	tmpObj.now = now;
	tmpObj.curSecs = curSecs;

	gl.render(scene, tmpObj.camera);

	if (gl.xr.isPresenting) {
		tmpObj.realCamera = gl.xr.getCamera(tmpObj.camera);
	}
	else {
		tmpObj.realCamera = tmpObj.camera;
	}
} // draw


// UPDATE RESIZE
function resizeDisplay() {
	const canvas = gl.domElement;
	const width = canvas.clientWidth;
	const height = canvas.clientHeight;
	const needResize = canvas.width != width || canvas.height != height;
	if (needResize) {
		gl.setSize(width, height, false);
	}
	return needResize;
} // resizeDisplay
