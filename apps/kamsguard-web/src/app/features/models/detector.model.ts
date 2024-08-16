// src/app/models/camera.model.ts
export interface CameraConfig {
    vid_std: string;
    hres: string;
    vres: string;
    aspect_ratio: string;
    resolutions: string;
    resolution_codes: string;
    camclass: string;
    mpeg_enabled: string;
    jpeg_enabled: string;
    h264_enabled: string;
    alarms: string;
    relays: string;
    audio_in: string;
    audio_out: string;
    lens_type: string;
    telm_cam_protocol: string;
    pixel_aspect: string;
    udp: string;
    supported_streams: string;
    custom_res: string;
    web_port: string;
  }
  
  export interface Camera {
    camera_num: number;
    phys_camera_num: number;
    title: string;
    site_id: string;
    cam_mode: number;
    config: CameraConfig;
    telemetry: number;
    remote_focus: number;
    coax_osd: number;
    virtual_ptz: number;
  }
  
  export interface CameraListResponse {
    camlist_version: string;
    sw_version: string;
    cip_cmd_proxy: number;
    cip_video_proxy: number;
    cip_proxy_map_enable: number;
    site_id: string;
    map_hotspot_graphic1: string;
    map_hotspots1: string[];
    map_hotspot_graphic2: string;
    map_hotspots2: string[];
    cameras: Camera[];
  }

export interface ConnectedDevice {
  siteId: string;
  localIp: string;
  responseArea: string;
  systemCamera: string;
}

export interface CamFailEvent {
  site_id: string;
  event: string;
  channel: number;
  time: string;
}
