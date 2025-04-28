import React from "react";
import { Controller } from "react-hook-form";
import { Editor } from "@tinymce/tinymce-react";

const RTE = ({ name, control, label, value = "" }) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block mb-2 text-sm font-medium text-slate-700 pl-1">
          {label}
        </label>
      )}
      <div className="border rounded-lg overflow-hidden shadow-sm focus-within:ring-2 focus-within:ring-blue-500">
        <Controller
          name={name || "content"}
          control={control}
          render={({ field: { onChange, value } }) => (
            <Editor
              value={value}
              onEditorChange={onChange}
              init={{
                height: 500,
                menubar: true,
                plugins: [
                  "advlist",
                  "autolink",
                  "lists",
                  "link",
                  "image",
                  "charmap",
                  "preview",
                  "anchor",
                  "searchreplace",
                  "visualblocks",
                  "code",
                  "fullscreen",
                  "insertdatetime",
                  "media",
                  "table",
                  "help",
                  "wordcount",
                ],
                toolbar:
                  "undo redo | blocks | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help",
                content_style:
                  "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
              }}
              apiKey={import.meta.env.VITE_tiny_mce_Key} 
            />
          )}
        />
      </div>
    </div>
  );
};

export default RTE;
