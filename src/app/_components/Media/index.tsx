import React, { Fragment } from "react";

import { Image } from "./Image";
import { Props } from "./types";
import { Video } from "./Video";
import { isNumber } from "../../_utilities/isNumber";

export const Media: React.FC<Props> = (props) => {
  const { className, resource, htmlElement = "div" } = props;

  const isVideo = !isNumber(resource) && resource?.mimeType?.includes("video");
  const Tag = (htmlElement as any) || Fragment;

  return (
    <Tag
      {...(htmlElement !== null
        ? {
            className,
          }
        : {})}
    >
      {isVideo ? <Video {...props} /> : <Image {...props} />}
    </Tag>
  );
};
