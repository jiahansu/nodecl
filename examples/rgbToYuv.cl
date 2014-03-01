/*
 * nodecl - An implementation of the JavaScript bindings for OpenCL.
 * https://github.com/jiahansu/nodecl
 *
 * Copyright (c) 2013-2013, Jia-Han Su (https://github.com/jiahansu)
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 * 
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of Jia-Han Su nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY JIA-HAN SU AND CONTRIBUTORS ``AS IS'' AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE REGENTS AND CONTRIBUTORS BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
#define FP_FAST_FMAF

__kernel void rgbToYuv(__read_only image2d_t sourceImage, const float2 invertMaxGlobalId,
        __write_only image2d_t yImage, __write_only image2d_t uImage,
        __write_only image2d_t vImage,const int2 yMaxIndex,const int2 uvMaxIndex) {
    const sampler_t sampler = CLK_NORMALIZED_COORDS_FALSE | CLK_ADDRESS_NONE | CLK_FILTER_NEAREST;
    float2 normalizedCoord;
    float4 color;
    float r, g, b, y, u, v;
    int2 yCoord, uvCoord;
 //printf("test test 1\n");
    normalizedCoord.x = get_global_id(0) *invertMaxGlobalId.x;/// (float)(get_global_size(0)-1);
    normalizedCoord.y = get_global_id(1) *invertMaxGlobalId.y;/// (float)(get_global_size(1)-1);
//printf("test test 2\n");
    color = read_imagef(sourceImage, sampler, (int2)(get_global_id(0), get_global_id(1)));
    
    r = color.x;
    g = color.y;
    b = color.z;
    //printf("test test 3\n");
    y = clamp(0.299f * r + 0.587f * g + 0.114f * b, 0.0f, 1.0f);
    u = clamp(-0.169f * r - 0.331f * g + 0.5f * b + 0.5f, 0.0f, 1.0f);
    v = clamp(0.5f * r - 0.419f * g - 0.081f * b + 0.5f, 0.0f, 1.0f);
 
    yCoord = (int2)(round(yMaxIndex.x*normalizedCoord.x), round(yMaxIndex.y*normalizedCoord.y));
    uvCoord = (int2)(round(uvMaxIndex.x*normalizedCoord.x), round(uvMaxIndex.y*normalizedCoord.y));
    /*
    if((get_global_id(0)==0 && get_global_id(1)==0) || true){
        printf("test %f %d %d \n",y,yCoord.x,yCoord.y);
    }*/
    /*
    if(isnan(y)){
        printf("ewfwfewfew \n");
    }*/
    
   //printf("test %d, %d \n",yCoord.x, yCoord.y);
    write_imagef(yImage,yCoord,(float4)(y,0.0,0.0,1.0));
    write_imagef(uImage,uvCoord,(float4)(u,0.0,0.0,1.0));
    write_imagef(vImage,uvCoord,(float4)(v,0.0,0.0,1.0));
}