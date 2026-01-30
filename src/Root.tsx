import React from "react";
import { Composition } from "remotion";
import { HelloWorld, HelloWorldSchema } from "./compositions";
import { DEFAULT_VIDEO_CONFIG } from "./shared/types";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="HelloWorld"
        component={HelloWorld}
        durationInFrames={DEFAULT_VIDEO_CONFIG.durationInFrames}
        fps={DEFAULT_VIDEO_CONFIG.fps}
        width={DEFAULT_VIDEO_CONFIG.width}
        height={DEFAULT_VIDEO_CONFIG.height}
        schema={HelloWorldSchema}
        defaultProps={{
          title: "Hello, Remotion!",
          subtitle: "视频生成演示",
          backgroundColor: "#0f0f23",
          textColor: "#ffffff",
          accentColor: "#6366f1",
        }}
      />
    </>
  );
};
