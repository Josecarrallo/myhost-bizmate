import { Config } from "@remotion/cli/config";

// Configuración de Remotion para MY HOST BizMate Videos
Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
Config.setConcurrency(4);

// Output settings
Config.setPixelFormat("yuv420p");
Config.setCodec("h264");
