function marchingCubes(arrayOfPoints, arrayOfValues, resolution, windingOpt){
    // Marching Cubes Algorithm
    var thisWindingOpt = windingOpt || 1;

    var resolution2 = Math.pow(resolution, 2);

    // Vertices may occur along edges of cube, when the values at the edge's endpoints
    //   straddle the isolevel value.
    // Actual position along edge weighted according to function values.
    var vlist = new Array(12);

    var geometry = new THREE.Geometry();
    var vertexIndex = 0;

    for (var z = 0; z < resolution - 1; z++)
        for (var y = 0; y < resolution - 1; y++)
            for (var x = 0; x < resolution - 1; x++)
            {
                // index of base point, and also adjacent points on cube
                var p    = x + resolution * y + resolution2 * z,
                    px   = p   + 1,
                    py   = p   + resolution,
                    pxy  = py  + 1,
                    pz   = p   + resolution2,
                    pxz  = px  + resolution2,
                    pyz  = py  + resolution2,
                    pxyz = pxy + resolution2;

                // store scalar values corresponding to vertices
                var value0 = arrayOfValues[ p ],
                    value1 = arrayOfValues[ px ],
                    value2 = arrayOfValues[ py ],
                    value3 = arrayOfValues[ pxy ],
                    value4 = arrayOfValues[ pz ],
                    value5 = arrayOfValues[ pxz ],
                    value6 = arrayOfValues[ pyz ],
                    value7 = arrayOfValues[ pxyz ];

                // place a "1" in bit positions corresponding to vertices whose
                //   isovalue is less than given constant.

                var isolevel = 0;

                var cubeindex = 0;
                if ( value0 < isolevel ) cubeindex |= 1;
                if ( value1 < isolevel ) cubeindex |= 2;
                if ( value2 < isolevel ) cubeindex |= 8;
                if ( value3 < isolevel ) cubeindex |= 4;
                if ( value4 < isolevel ) cubeindex |= 16;
                if ( value5 < isolevel ) cubeindex |= 32;
                if ( value6 < isolevel ) cubeindex |= 128;
                if ( value7 < isolevel ) cubeindex |= 64;

                // bits = 12 bit number, indicates which edges are crossed by the isosurface
                var bits = THREE.edgeTable[ cubeindex ];

                // if none are crossed, proceed to next iteration
                if ( bits === 0 ) continue;

                // check which edges are crossed, and estimate the point location
                //    using a weighted average of scalar values at edge endpoints.
                // store the vertex in an array for use later.
                var mu = 0.5;

                // bottom of the cube
                if ( bits & 1 ){
                    mu = ( isolevel - value0 ) / ( value1 - value0 );
                    vlist[0] = arrayOfPoints[p].clone().lerp( arrayOfPoints[px], mu );
                }
                if ( bits & 2 ){
                    mu = ( isolevel - value1 ) / ( value3 - value1 );
                    vlist[1] = arrayOfPoints[px].clone().lerp( arrayOfPoints[pxy], mu );
                }
                if ( bits & 4 ){
                    mu = ( isolevel - value2 ) / ( value3 - value2 );
                    vlist[2] = arrayOfPoints[py].clone().lerp( arrayOfPoints[pxy], mu );
                }
                if ( bits & 8 ){
                    mu = ( isolevel - value0 ) / ( value2 - value0 );
                    vlist[3] = arrayOfPoints[p].clone().lerp( arrayOfPoints[py], mu );
                }
                // top of the cube
                if ( bits & 16 ){
                    mu = ( isolevel - value4 ) / ( value5 - value4 );
                    vlist[4] = arrayOfPoints[pz].clone().lerp( arrayOfPoints[pxz], mu );
                }
                if ( bits & 32 ){
                    mu = ( isolevel - value5 ) / ( value7 - value5 );
                    vlist[5] = arrayOfPoints[pxz].clone().lerp( arrayOfPoints[pxyz], mu );
                }
                if ( bits & 64 ){
                    mu = ( isolevel - value6 ) / ( value7 - value6 );
                    vlist[6] = arrayOfPoints[pyz].clone().lerp( arrayOfPoints[pxyz], mu );
                }
                if ( bits & 128 ){
                    mu = ( isolevel - value4 ) / ( value6 - value4 );
                    vlist[7] = arrayOfPoints[pz].clone().lerp( arrayOfPoints[pyz], mu );
                }
                // vertical lines of the cube
                if ( bits & 256 ){
                    mu = ( isolevel - value0 ) / ( value4 - value0 );
                    vlist[8] = arrayOfPoints[p].clone().lerp( arrayOfPoints[pz], mu );
                }
                if ( bits & 512 ){
                    mu = ( isolevel - value1 ) / ( value5 - value1 );
                    vlist[9] = arrayOfPoints[px].clone().lerp( arrayOfPoints[pxz], mu );
                }
                if ( bits & 1024 ){
                    mu = ( isolevel - value3 ) / ( value7 - value3 );
                    vlist[10] = arrayOfPoints[pxy].clone().lerp( arrayOfPoints[pxyz], mu );
                }
                if ( bits & 2048 ){
                    mu = ( isolevel - value2 ) / ( value6 - value2 );
                    vlist[11] = arrayOfPoints[py].clone().lerp( arrayOfPoints[pyz], mu );
                }

                // construct triangles -- get correct vertices from triTable.
                var i = 0;
                cubeindex <<= 4;  // multiply by 16...
                // "Re-purpose cubeindex into an offset into triTable."
                //  since each row really isn't a row.

                // the while loop should run at most 5 times,
                //   since the 16th entry in each row is a -1.
                while ( THREE.triTable[ cubeindex + i ] != -1 )
                {
                    var index1 = THREE.triTable[cubeindex + i];
                    var index2 = THREE.triTable[cubeindex + i + 1];
                    var index3 = THREE.triTable[cubeindex + i + 2];

                    geometry.vertices.push( vlist[index1].clone() );
                    geometry.vertices.push( vlist[index2].clone() );
                    geometry.vertices.push( vlist[index3].clone() );

                    if(thisWindingOpt == 1){
                        var face = new THREE.Face3(vertexIndex, vertexIndex+1, vertexIndex+2);
                    }
                    if(thisWindingOpt == 2){
                        var face = new THREE.Face3(vertexIndex+2, vertexIndex+1, vertexIndex);
                    }

                    geometry.faces.push( face );

                    geometry.faceVertexUvs[ 0 ].push( [ new THREE.Vector2(0,0), new THREE.Vector2(0,1), new THREE.Vector2(1,1) ] );

                    vertexIndex += 3;
                    i += 3;
                }
            }

    geometry.computeCentroids();
    geometry.computeFaceNormals();
    geometry.computeVertexNormals();

    return geometry;
}