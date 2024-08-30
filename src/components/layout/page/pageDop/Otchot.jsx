import { useRef, useState } from 'react';
import Handsontable from 'handsontable';
import { HotTable } from '@handsontable/react';
import { writeFile, utils } from 'xlsx';
import 'handsontable/dist/handsontable.full.min.css';

function ExcelTable() {
  const hotTableRef = useRef(null);
  const [rowCount, setRowCount] = useState(3);
  const [colCount, setColCount] = useState(3);

  const getDataArray = (rows, cols) => {
    return Array.from({ length: rows }, () => Array(cols).fill(''));
  };

  const [data, setData] = useState(getDataArray(rowCount, colCount));

  console.log(data);
  

  const handleAddRow = () => {
    const newRow = Array(colCount).fill('');
    setData((prevData) => [...prevData, newRow]);
    setRowCount(rowCount + 1);
  };

  const handleRemoveRow = () => {
    if (rowCount > 1) {
      setData((prevData) => prevData.slice(0, -1));
      setRowCount(rowCount - 1);
    }
  };

  const handleAddCol = () => {
    const newData = data.map((row) => [...row, '']);
    setData(newData);
    setColCount(colCount + 1);
  };

  const handleRemoveCol = () => {
    if (colCount > 1) {
      const newData = data.map((row) => row.slice(0, -1));
      setData(newData);
      setColCount(colCount - 1);
    }
  };

  const fillData = () => {
    const newData = getDataArray(rowCount, colCount).map((row, rowIndex) =>
      row.map((cell, cellIndex) => ` ${rowIndex + 1}-${cellIndex + 1}`)
    );
    setData(newData);
    hotTableRef.current.hotInstance.loadData(newData);
  };

  const saveAsExcel = () => {
    const hotInstance = hotTableRef.current.hotInstance;
    const data = hotInstance.getData();
    const worksheet = utils.aoa_to_sheet(data);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    writeFile(workbook, 'table_data.xlsx');
  };

  return (
    <div>
      <div className='CreateTable'>
        <button onClick={handleAddRow}>Добавить строку</button>
        <button onClick={handleRemoveRow}>Удалить строку</button>
        <button onClick={handleAddCol}>Добавить столбец</button>
        <button onClick={handleRemoveCol}>Удалить столбец</button>
        <button onClick={fillData}>Заполнить данными</button>
        <button onClick={saveAsExcel}>Сохранить как Excel</button>
      </div>
      <HotTable
        ref={hotTableRef}
        data={data}
        colHeaders={true}
        rowHeaders={true}
        contextMenu={true}
        stretchH="all"
        manualColumnResize={true}
        manualRowResize={true}
        width="1034px"
        height="500px"
        className="excel-table"
        licenseKey="non-commercial-and-evaluation"
      />
    </div>
  );
}

export default ExcelTable;
