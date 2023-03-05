import { decode } from "image-js";

export async function loadImage(imageName: string = "/test/good.jpg") {
  console.log("Loading image", imageName);
  const response = await fetch(imageName);
  const arrayBuffer = await response.arrayBuffer();
  // TODO: I would prefer to directly use the arrayBuffer here
  return decode(new Uint8Array(arrayBuffer));
}
