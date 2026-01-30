import React, { forwardRef, useImperativeHandle } from "react";
import { useFormLogic } from "./useFormLogic";
import FormField from "./FormField";
// import "./dynamicForm.css";
import "./Form.css";

// Menggunakan forwardRef agar 'ref' dari parent bisa masuk ke sini
const DynamicForm = forwardRef(({ category, onSubmitSuccess, noReport }, ref) => {
  const { 
    formStructure, 
    formData, 
    staffListME, 
    errorField, 
    handleChange, 
    handleSubmit 
  } = useFormLogic(category, onSubmitSuccess);

  // Bagian ini menghubungkan tombol di parent ke fungsi handleSubmit di hook
  useImperativeHandle(ref, () => ({
    submit: () => handleSubmit(noReport) 
  }));

  return (
    <form 
      onSubmit={(e) => { e.preventDefault(); handleSubmit(noReport); }} 
      className="forceklist"
    >
      <div className="category-title">
        <h3>Bagian: {category.replace('_', ' ').toUpperCase()}</h3>
      </div>
      <div id="item-container-ceklist" className={category}>
        {Object.entries(formStructure).map(([tableName, columns]) => (
          <fieldset key={tableName} className="ceklist-box-sector" id={tableName}>
            <legend>{tableName}</legend>
            {columns
              .filter(c => !(tableName === "report_info" && ["id", "status"].includes(c.Field)))
              .map(col => (
                <FormField
                  key={col.Field}
                  tableName={tableName}
                  col={col}
                  value={formData[tableName]?.[col.Field]}
                  onChange={handleChange}
                  staffList={staffListME}
                  isError={errorField === `${tableName}_${col.Field}`}
                />
              ))}
          </fieldset>
        ))}
      </div>
    </form>
  );
});

export default DynamicForm;