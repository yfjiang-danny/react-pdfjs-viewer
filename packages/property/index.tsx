import React, { FC, useEffect, useLayoutEffect, useState } from "react";
import { usePDFViewer } from "../provider";
import { Metadata } from "pdfjs-dist/types/display/metadata";
import {
  getPageSizeInches,
  parseDate,
  parseFileSize,
} from "../utils/properties";
import { getFilenameFromUrl } from "pdfjs-dist";

interface PropertiesModel {
  fileName?: string;
  fileSize?: string;
  title?: string;
  author?: string;
  subject?: string;
  keywords?: string;
  creationDate?: string;
  modificationDate?: string;
  creator?: string;
  producer?: string;
  version?: string;
  pageCount: number;
  pageSize: string;
  isWebView?: boolean;
}

interface PropertyModalProps {}

const PropertyModal: FC<PropertyModalProps> = (props) => {
  const { pdfURI, pdfDoc, currentPage } = usePDFViewer();

  const [properties, setProperties] = useState<PropertiesModel>();

  useLayoutEffect(() => {
    if (pdfDoc) {
      Promise.all([pdfDoc.getMetadata(), pdfDoc.getPage(currentPage)])
        .then(
          ([pdfInfo, pageDoc]) => {
            const infoObj = pdfInfo.info as any;
            const fileName =
              (pdfInfo as any)["contentDispositionFilename"] ||
              getFilenameFromUrl(pdfURI);
            setProperties({
              pageSize: "",
              fileSize: parseFileSize(
                (pdfInfo as any)["contentLength"] as number
              ),
              creationDate: parseDate(infoObj["CreationDate"]),
              modificationDate: parseDate(infoObj.ModDate),
              fileName,
              title: infoObj.Title,
              author: infoObj.Author,
              subject: infoObj.Subject,
              keywords: infoObj.Keywords,
              creator: infoObj.Creator,
              producer: infoObj.Producer,
              version: infoObj.PDFFormatVersion,
              pageCount: pdfDoc.numPages,
            });
          },
          (err) => {
            //
          }
        )
        .catch((reason) => {
          //
        });
    }
  }, [currentPage, pdfDoc, pdfURI]);

  useEffect(() => {
    console.log("property", properties);
  }, [properties]);

  return <>PropertyModal Component</>;
};

export default PropertyModal;
