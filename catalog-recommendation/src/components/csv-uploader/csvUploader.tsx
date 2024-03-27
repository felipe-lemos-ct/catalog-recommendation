/* eslint-disable @typescript-eslint/no-explicit-any */
import { PageContentFull } from '@commercetools-frontend/application-components';
import React, { useState } from 'react';

import Text from '@commercetools-uikit/text';
import Spacings from '@commercetools-uikit/spacings';
import DataTable from '@commercetools-uikit/data-table';
import SecondaryButton from '@commercetools-uikit/secondary-button';

interface CSVData {
  [key: string]: string;
}
interface CSVUploaderProps {
  setFileName: any;
  setCSVData: any;
  csvData: any;
}

const CSVUploader: React.FC<CSVUploaderProps> = ({
  setFileName,
  setCSVData,
  csvData,
}) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [rowsPerPage] = useState<number>(10);

  const handleFileInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      setFileName(file.name.substring(0, file.name.indexOf('.')));
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target) {
          const contents = e.target.result as string;
          const rows = contents.split('\n');
          const data: CSVData[] = [];
          const headers = rows[0].replace(/(\r\n|\n|\r)/gm, '').split(',');
          for (let i = 1; i < rows.length; i++) {
            const rowData = rows[i].split(',');
            if (rowData.length === headers.length) {
              const rowObject: CSVData = {};
              for (let j = 0; j < headers.length; j++) {
                rowObject[headers[j]] = rowData[j].replace(
                  /(\r\n|\n|\r)/gm,
                  ''
                );
              }
              data.push(rowObject);
            }
          }
          setCSVData(data);
        }
      };
      reader.readAsText(file);
    }
  };

  const columns = Object.keys(csvData[0] || {}).map((header) => {
    return { key: header, label: header };
  });

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = csvData.slice(indexOfFirstRow, indexOfLastRow);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <PageContentFull>
      <Spacings.Stack>
        <div className="py-30">
          <Text.Headline as="h1">Catalog Recommendation Uploader</Text.Headline>
          <div className="pt-10">
            <Text.Headline as="h3">Upload CSV file</Text.Headline>
            <input
              type="file"
              accept=".csv"
              className="pt-5"
              onChange={handleFileInputChange}
            />
          </div>

          <Spacings.Stack scale="l">
            <Spacings.Stack scale="xs">
              {columns.length > 0 ? (
                <>
                  <div className="p-10 -pt-5">
                    <Text.Headline as="h3">
                      Catalog Recommendation Preview:
                    </Text.Headline>
                    <div className="pt-5">
                      <DataTable
                        rows={currentRows}
                        columns={columns}
                        maxWidth={600}
                      />
                    </div>
                    {csvData.length > rowsPerPage ? (
                      <div>
                        <SecondaryButton
                          style={{
                            padding: 10,
                            margin: 10,
                            minWidth: 100,
                            textAlign: 'justify',
                          }}
                          label="Previous"
                          onClick={() => paginate(currentPage - 1)}
                          disabled={currentPage === 1}
                        />

                        <SecondaryButton
                          style={{
                            padding: 10,
                            margin: 10,
                            minWidth: 100,
                            textAlign: 'justify',
                          }}
                          label="Next"
                          onClick={() => paginate(currentPage + 1)}
                          disabled={indexOfLastRow >= csvData.length}
                        />
                      </div>
                    ) : null}
                  </div>
                </>
              ) : null}
            </Spacings.Stack>
          </Spacings.Stack>
        </div>
      </Spacings.Stack>
    </PageContentFull>
  );
};

export default CSVUploader;
