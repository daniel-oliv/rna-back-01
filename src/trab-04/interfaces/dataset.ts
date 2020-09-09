import { ImgCharDatum } from './image-digit-datum';

export interface Dataset{
  id: string,
  data: ImgCharDatum[],
  /// map 
  // dic?: {string: }
}