import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import CustomModal from "../Modal/Modal";
import Button from "./Button";
import CustomSelect from "./Select";
import { useLocation } from "react-router-dom";

function Table(props) {
  const { data, columns, sub } = props;
  const [search, setSearch] = useState("");
  const [datas, setTempData] = useState(data);
  const [selectedOption, setSelectedOption] = useState(null);
  const location = useLocation();
  // const uniqueCategories = data.data?.reduce((acc, product) => {
  //   if (!acc.includes(product.category)) {
  //     acc.push(product.category);
  //   }
  //   return acc ?? [];
  // }, []);

  const handleSelectChange = (event) => {
    setSelectedOption(event.target.value);
  };
  const customHeader = (
    <div>
      <span>Custom Header</span>
      <CustomSelect onChange={handleSelectChange} />
    </div>
  );

  useEffect(() => {
    if (search === "") {
      setTempData(data);
    } else {
      const result = datas.filter((product) => {
        const values = Object.values(product).join().toLowerCase();
        return values.includes(search.toLowerCase());
      });
      setTempData(result);
    }
  }, [search, data]);
  useEffect(() => {
    if (selectedOption !== null) {
      const result = data.filter((product) => {
        const values = Object.values(product).join().toLowerCase();
        return values.includes(selectedOption.toLowerCase());
      });
      setTempData(result);
    }
  }, [selectedOption]);

  return (
    <>
      {data &&
        (
          <div style={{ overflowX: 'auto' }}>

            <DataTable
              columns={columns}
              data={Array.isArray(datas) ? datas : []}
              pagination
              fixedHeader
              fixedHeaderScrollHeight="450px"
              progressComponent={<div>Loading...</div>}
              selectableRows
              selectableRowsHighlight
            />
          </div>
        )
      }
    </>
  );
}

export default Table;
