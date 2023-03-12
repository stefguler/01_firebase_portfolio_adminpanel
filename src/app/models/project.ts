export class Project {
  id: string;
  date: Date;
  object: string;
  model: string;
  title: string;
  description: string;
  technique: string;
  colors: string[];
  price: string;
  imgPreName: string;
  imgPreSrc: string;
  imgPostName: string;
  imgPostSrc: string;
  altText: string;
}

export enum ImageType {
  pre = "pre",
  post = "post"
}