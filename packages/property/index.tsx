import React, { FC, useEffect, useLayoutEffect, useState } from "react";
import { usePDFViewer } from "../provider";
import { Metadata } from "pdfjs-dist/types/display/metadata";
import {
  getPageSizeInches,
  parseDate,
  parseFileSize,
} from "../utils/properties";
import { getFilenameFromUrl } from "pdfjs-dist";
import Modal, { ModalProps } from "../share/modal";
import "./index.less";
import Button from "../share/button";

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

interface PropertyModalProps extends ModalProps {
  onClose?(): void;
}

const PropertyModal: FC<PropertyModalProps> = ({ visible, onClose }) => {
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
            const pageSize = getPageSizeInches(pageDoc);
            setProperties({
              pageSize: `${pageSize.width * 2.54}cm*${pageSize.height * 2.54}cm`,
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

  return (
    <Modal className="property-modal" visible={visible}>
      <div className="session">
        <div className="row">
          <div className="label">文件名：</div>
          <div className="value">{properties?.fileName}</div>
        </div>
        <div className="row">
          <div className="label">文件大小：</div>
          <div className="value">{properties?.fileSize}</div>
        </div>
      </div>
      <div className="session">
        <div className="row">
          <div className="label">标题：</div>
          <div className="value">{properties?.title}</div>
        </div>
        <div className="row">
          <div className="label">作者：</div>
          <div className="value">{properties?.author}</div>
        </div>
        <div className="row">
          <div className="label">主题：</div>
          <div className="value">{properties?.subject}</div>
        </div>
        <div className="row">
          <div className="label">关键词：</div>
          <div className="value">{properties?.keywords}</div>
        </div>
        <div className="row">
          <div className="label">创建日期：</div>
          <div className="value">{properties?.creationDate}</div>
        </div>
        <div className="row">
          <div className="label">修改日期：</div>
          <div className="value">{properties?.modificationDate}</div>
        </div>
        <div className="row">
          <div className="label">创建者：</div>
          <div className="value">{properties?.creator}</div>
        </div>
      </div>
      <div className="session">
        <div className="row">
          <div className="label">PDF 生成器：</div>
          <div className="value">{properties?.producer}</div>
        </div>
        <div className="row">
          <div className="label">PDF 版本：</div>
          <div className="value">{properties?.version}</div>
        </div>
        <div className="row">
          <div className="label">页数：</div>
          <div className="value">{properties?.pageCount}</div>
        </div>
        <div className="row">
          <div className="label">页面大小：</div>
          <div className="value">{properties?.pageSize}</div>
        </div>
      </div>
      <div className="session">
        <div className="row">
          <div className="label">快速 Web 视图：</div>
          <div className="value">{properties?.isWebView}</div>
        </div>
      </div>
      <div className="btn-wrapper">
        <Button className="close-btn" onClick={onClose}>
          关闭
        </Button>
      </div>
    </Modal>
  );
};

export default PropertyModal;
