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

var my = require("myclass"), bridjs = require("bridjs"),
        Signature = bridjs.Signature, 
        NodeCLException = require("./nodecl_exception");

ImageFormat = bridjs.defineStruct(
        {
            imageChannelOrder: bridjs.structField(Signature.uint, 0), //cl_channel_order        image_channel_order;
            imageChannelDataType: bridjs.structField(Signature.uint, 1) //cl_channel_type         image_channel_data_type;
        });

ImageDesc = bridjs.defineStruct({
    imageType: bridjs.structField(Signature.uint, 0), //cl_mem_object_type      image_type;
    imageWidth: bridjs.structField(Signature.size, 1), //size_t                  image_width;
    imageHeight: bridjs.structField(Signature.size, 2), //size_t                  image_height;
    imageDepth: bridjs.structField(Signature.size, 3), //size_t                  image_depth;
    imageArraySize: bridjs.structField(Signature.size, 4), //size_t                  image_array_size;
    imageRowPitch: bridjs.structField(Signature.size, 5), //size_t                  image_row_pitch;
    imageSlicePitch: bridjs.structField(Signature.size, 6), //size_t                  image_slice_pitch;
    numMipLevels: bridjs.structField(Signature.uint, 7), //cl_uint                 num_mip_levels;
    numSamples: bridjs.structField(Signature.uint, 8), //cl_uint                 num_samples;
    buffer: bridjs.structField(Signature.pointer, 9)//cl_mem                  buffer;
});

BufferRegion = bridjs.defineStruct({
    origin: bridjs.structField(Signature.size, 0), //size_t                  origin;
    size: bridjs.structField(Signature.size, 1)//size_t                  size;
});// cl_buffer_region;

module.exports = my.Class(Signature, {
    STATIC:{
        ImageFormat: ImageFormat,
        ImageDesc: ImageDesc,
        BufferRegion: BufferRegion,
        bool: Signature.bool,                     /* WARNING!  Unlike cl_ types in cl_platform.h, cl_bool is not guaranteed to be the same size as the bool in kernels. */ 
        bitfield: Signature.uint64, //typedef cl_ulong            cl_bitfield;
        deviceType: Signature.uint64,//typedef cl_bitfield         cl_device_type;
        platformInfo: Signature.uint,//typedef cl_uint             cl_platform_info;
        deviceInfo: Signature.uint,//typedef cl_uint             cl_device_info;
        deviceFpConfig: Signature.uint64,//typedef cl_bitfield         cl_device_fp_config;
        deviceMemCacheType: Signature.uint,//typedef cl_uint             cl_device_mem_cache_type;
        deviceLocalMemType:  Signature.uint,//typedef cl_uint             cl_device_local_mem_type;
        deviceExecCapabilities: Signature.uint64,//typedef cl_bitfield         cl_device_exec_capabilities;
        commandQueueProperties: Signature.uint64,//typedef cl_bitfield         cl_command_queue_properties;
        intptrT: Signature.pointer,
        devicePartitionProperty: Signature.pointer,//typedef intptr_t            cl_device_partition_property;
        deviceAffinityDomain: Signature.uint64,//typedef cl_bitfield         cl_device_affinity_domain;
        contextProperties: Signature.pointer,//typedef intptr_t            cl_context_properties;
        contextInfo:Signature.uint,//typedef cl_uint             cl_context_info;
        commandQueueInfo:Signature.uint,//typedef cl_uint             cl_command_queue_info;
        channelOrder:Signature.uint,//typedef cl_uint             cl_channel_order;
        channelType: Signature.uint,//typedef cl_uint             cl_channel_type;
        memFlags: Signature.uint64,//typedef cl_bitfield         cl_mem_flags;
        memObjectType: Signature.uint,//typedef cl_uint             cl_mem_object_type;
        memInfo:  Signature.uint,//typedef cl_uint             cl_mem_object_type;
        memMigrationFlags: Signature.uint64,//typedef cl_bitfield         cl_mem_migration_flags;
        imagInfo: Signature.uint, //typedef cl_uint             cl_image_info;
        bufferCreateType:Signature.uint, //typedef cl_uint             cl_buffer_create_type;
        addressingMode: Signature.uint, //typedef cl_uint             cl_addressing_mode;
        filterMode: Signature.uint,// typedef cl_uint             cl_filter_mode;
        samplerInfo: Signature.uint,//typedef cl_uint             cl_sampler_info;
        mapFlags: Signature.uint64,//typedef cl_bitfield         cl_map_flags;
        programInfo: Signature.uint,//typedef cl_uint             cl_program_info;
        programBuildInfo: Signature.uint,//typedef cl_uint             cl_program5_build_info;
        programBinaryType: Signature.uint,//typedef cl_uint             cl_program_binary_type;
        buildStatus:Signature.int,//typedef cl_uint             cl_program_binary_type;
        kernelInfo: Signature.uint,//typedef cl_int              cl_build_status;
        kernelArgInfo: Signature.uint,//typedef cl_uint             cl_kernel_arg_info;
        kernelArgAddressQualifier: Signature.uint,//typedef cl_uint             cl_kernel_arg_address_qualifier;
        kernelArgAccessQualifier: Signature.uint,//typedef cl_uint             cl_kernel_arg_access_qualifier;
        kernelArgTypeQualifier: Signature.uint64,//typedef cl_bitfield         cl_kernel_arg_type_qualifier;
        kernelWorkGroupInfo:Signature.uint,//typedef cl_uint             cl_kernel_work_group_info;
        eventInfo: Signature.uint,//typedef cl_uint             cl_event_info;
        commandType: Signature.uint,//typedef cl_uint             cl_command_type;
        profilingInfo: Signature.uint,//typedef cl_uint             cl_profiling_info;
        mem:Signature.pointer,
        platformId:Signature.pointer,
        deviceId:Signature.pointer,
        commandQueue:Signature.pointer,
        context:Signature.pointer,
        createContextNotify:bridjs.defineFunction(Signature.void, Signature.string, Signature.pointer, Signature.size, Signature.pointer),
        buildProgramNotify:bridjs.defineFunction(Signature.void, Signature.pointer, Signature.pointer),
        enqueueNativeKernelUserFunc:bridjs.defineFunction(Signature.void, Signature.pointer),
        setEventCallbackCallback:bridjs.defineFunction(Signature.void,Signature.int, Signature.pointer)
    }
});


