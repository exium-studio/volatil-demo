import {
  DownloadTrigger as ChakraDownloadTrigger,
  type DownloadTriggerProps,
} from "@chakra-ui/react";

export const DownloadTrigger = (props: DownloadTriggerProps) => {
  return <ChakraDownloadTrigger asChild {...props} />;
};
