import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import {
  getCategories,
  getTechnologies,
} from "../../../redux/actions/templatesAction";
import { useEffect, useState } from "react";
import validation from "./validation";
import { createTemplate } from "../../../redux/actions/adminTemplatesAction";

const CreateTemplate = () => {
    const { technologies, categories } = useSelector(
        (state) => state.templates.filters
      );
      const dispatch = useDispatch();
      const [NewTechnology, setNewTechnology] = useState("");
      const [NewCategory, setNewCategory] = useState("");
      const [templateData, setTemplateData] = useState({
        name: "",
        description: "",
        price: 0,
        isCover: [],
        image: [],
        technology: [],
        category: [],
      });
    
      const [errors, setErrors] = useState({
        name: "",
        description: "",
        price: "",
        isCover: "",
        image: "",
        technology: "",
        category: "",
        NewTechnology: "",
        NewCategory: "",
      });
    
      useEffect(() => {
        dispatch(getTechnologies());
        dispatch(getCategories());
      }, []);
    
      const handleChange = (e) => {
        const { name, value } = e.target;
    
        if (name === "technology") {
          if (value === "Seleccionar tecnologias") {
            return;
          }
          if (!templateData.technology.includes(value)) {
            setTemplateData((prevState) => ({
              ...prevState,
              technology: [...prevState.technology, value],
            }));
            const partialInput = {
              ...templateData,
              technology: [...templateData.technology, value],
            };
    
            setErrors(validation(partialInput, "technology"));
          }
        } else if (name === "category") {
          if (value === "Seleccionar categorias") {
            return;
          }
          if (!templateData.category.includes(value)) {
            setTemplateData((prevState) => ({
              ...prevState,
              category: [...prevState.category, value],
            }));
            const partialInput = {
              ...templateData,
              category: [...templateData.category, value],
            };
    
            setErrors(validation(partialInput, "category"));
          }
        } else {
          setTemplateData((prevState) => ({
            ...prevState,
            [name]: value,
          }));
    
          const partialInput = {
            ...templateData,
            [name]: value,
          };
    
          setErrors(validation(partialInput, name));
        }
      };
      const handleRemove = (dataType, dataValue) => (e) => {
        e.preventDefault();
    
        setTemplateData((prevState) => ({
          ...prevState,
          [dataType]: prevState[dataType].filter((item) => item !== dataValue),
        }));
    
        const copyOfTemplateData = JSON.parse(JSON.stringify(templateData));
    
        if (copyOfTemplateData[dataType].includes(dataValue)) {
          const index = copyOfTemplateData[dataType].indexOf(dataValue);
          copyOfTemplateData[dataType].splice(index, 1);
        }
    
        const errorsAfterRemoval = validation(copyOfTemplateData, dataType);
    
        setErrors(errorsAfterRemoval);
      };
      const handleAddCategory = (e) => {
        e.preventDefault();
    
        if (NewCategory.trim().length > 10) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            NewCategory: "La categoría no puede tener más de 10 caracteres.",
          }));
          return;
        }
    
        if (NewCategory) {
          const resultado = templateData.category.some(
            (str) => str === NewCategory
          );
          if (!resultado) {
            setTemplateData((prevState) => ({
              ...prevState,
              category: [...prevState.category, NewCategory],
            }));
            const partialInput = {
              ...templateData,
              category: [...templateData.category, NewCategory],
            };
    
            setErrors(validation(partialInput, "category")); // Valida después de agregar
            setNewCategory(""); // Limpia el input después de agregar
          }
        }
      };
    
      const handleAddTechnology = (e) => {
        e.preventDefault();
    
        if (NewTechnology.trim().length > 10) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            NewTechnology: "La tecnología no puede tener más de 10 caracteres.",
          }));
          return; // Detiene la adición si el error de validación se encuentra
        }
    
        if (NewTechnology) {
          const resultado = templateData.technology.some(
            (str) => str === NewTechnology
          );
          if (!resultado) {
            // Agrega la nueva tecnología al estado de 'technology'
            setTemplateData((prevState) => ({
              ...prevState,
              technology: [...prevState.technology, NewTechnology],
            }));
            const partialInput = {
              ...templateData,
              technology: [...templateData.technology, NewTechnology],
            };
    
            setErrors(validation(partialInput, "technology")); // Valida después de agregar
            setNewTechnology(""); // Limpia el input después de agregar
          }
        }
      };
    
      const handleDisable = () => {
        let hasErrors = false;
        let hasEmptyFields = false;
    
        for (let err in errors) {
          if (errors[err] !== "") {
            hasErrors = true;
            break;
          }
        }
        for (let data in templateData) {
          if (templateData[data] === "") {
            hasEmptyFields = true;
            break;
          }
        }
      
        return hasErrors || hasEmptyFields;
    
      };
    
      const handleSubmit = async () => {
        try {
         const technologyAsString = templateData.technology.join(", ");
         const categoryAsString = templateData.category.join(", ");
         const formWithTeamsAsString = {
           ...templateData,
           technology: technologyAsString,
           category: categoryAsString
         };
         dispatch(createTemplate(formWithTeamsAsString));
       
        } catch (error) {
         console.log("error");
        }
    
       };
    
      const changeUploadImageCover = async (e) => {
        const { name, value } = e.target;
        let partialInput = {};
    
        if (name === "isCover") {
          const file = e.target.files[0];
          const data = new FormData();
          data.append("file", file);
          data.append("upload_preset", "Cover_images");
    
          const response = await axios.post(
            "https://api.cloudinary.com/v1_1/daxqhy1pz/image/upload",
            data
          );
          if (response.data.secure_url) {
            partialInput = {
              ...templateData,
              isCover: [response.data.secure_url],
            };
            setTemplateData((prevState) => ({
              ...prevState,
              isCover: [response.data.secure_url],
            }));
            setErrors(validation(partialInput, "isCover"));
          } else {
            setTemplateData((prevState) => ({ ...prevState, isCover: [] }));
          }
        } else if (name === "image") {
          const file = e.target.files[0];
          const data = new FormData();
          data.append("file", file);
          data.append("upload_preset", "Detail_User");
    
          const response = await axios.post(
            "https://api.cloudinary.com/v1_1/daxqhy1pz/image/upload",
            data
          );
          if (response.data.secure_url) {
            partialInput = {
              ...templateData,
              image: [...templateData.image, response.data.secure_url],
            };
            setTemplateData((prevState) => ({
              ...prevState,
              image: [...prevState.image, response.data.secure_url],
            }));
            setErrors(validation(partialInput, "image"));
          } else {
            setTemplateData((prevState) => ({ ...prevState, image: [] }));
          }
        }
      };
    
      // Luego de procesar todas las imágenes, actualizamos el estado
      const removeImage = (type, imageName) => (e) => {
        e.preventDefault();
        // Actualiza el estado de templateData para eliminar la imagen especificada
        const updatedTemplateData = {
          ...templateData,
          [type]: templateData[type].filter((imageUrl) => imageUrl !== imageName),
        };
    
        // Crea una copia de templateData para realizar la validación sin modificarlo
        const copyOfTemplateData = JSON.parse(JSON.stringify(updatedTemplateData));
    
        // Elimina la referencia a la imagen removida en la copia para simular la eliminación
        // Mantén la estructura del objeto para la validación
        if (copyOfTemplateData[type].includes(imageName)) {
          const index = copyOfTemplateData[type].indexOf(imageName);
          copyOfTemplateData[type].splice(index, 1);
        }
    
        // Realiza la validación nuevamente para actualizar los errores
        const errorsAfterRemoval = validation(copyOfTemplateData, type);
    
        // Actualiza el estado de errors con los resultados de la validación
        setErrors((prevErrors) => ({
          ...prevErrors,
          ...errorsAfterRemoval,
        }));
    
        // Limpia el estado de templateData para reflejar la eliminación en el UI
        setTemplateData((prevState) => ({
          ...prevState,
          [type]: prevState[type].filter((imageUrl) => imageUrl !== imageName),
        }));
      };
    
      return (
        <div>
          <form  onSubmit={handleSubmit}>
            <div>
              <div>
                <label>Nombre</label>
                <input onChange={handleChange} name="name" type="text" />
                {errors.name ? <label>{errors.name}</label> : null}
              </div>
              <div>
                <label>Descripcion</label>
                <textarea onChange={handleChange} name="description" type="text" />
                {errors.description ? <label>{errors.description}</label> : null}
              </div>
              <div>
                <label>Precio</label>
                <input
                  onChange={handleChange}
                  name="price"
                  type="number"
                  min="0"
                  step="any"
                />
                {errors.price ? <label>{errors.price}</label> : null}
              </div>
              <div>
                <label>Imagen de portada</label>
                <input
                  onChange={changeUploadImageCover}
                  name="isCover"
                  type="file"
                  accept="image/*"
                />
                {errors.isCover ? <label>{errors.isCover}</label> : null}
                {templateData.isCover.length > 0 && (
                  <div>
                    {templateData.isCover.map((url, index) => (
                      <div key={index}>
                        <img
                          src={url}
                          alt={`Selected Image ${index}`}
                          style={{ width: "100px", height: "auto" }}
                        />
                        <button onClick={removeImage("isCover", url)}>X</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <label>Imagenes de detalle</label>
                <input
                  onChange={changeUploadImageCover}
                  name="image"
                  type="file"
                  multiple
                  accept="image/*"
                />
                {errors.image ? <label>{errors.image}</label> : null}
                {templateData.image.length > 0 && (
                  <div>
                    {templateData.image.map((image, index) => (
                      <div key={index}>
                        <img
                          src={image}
                          alt={`Selected Image`}
                          style={{ width: "100px", height: "auto" }}
                        />
                        <button onClick={removeImage("image", image)}>X</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <label>Tecnologias</label>
                <select onChange={handleChange} name="technology">
                  <option>Seleccionar tecnologias</option>
                  {[...technologies].sort().map((tech) => (
                    <option key={tech.id} value={tech.name}>
                      {tech.name}
                    </option>
                  ))}
                </select>
                {errors.technology ? <label>{errors.technology}</label> : null}
                <div>
                  {templateData.technology.map((tech, index) => (
                    <div key={index}>
                      <p>{tech}</p>
                      <button onClick={handleRemove("technology", tech)}>X</button>
                    </div>
                  ))}
                </div>
                <label>Nueva Tecnologia</label>
                <input
                  onChange={(e) => setNewTechnology(e.target.value)}
                  // onBlur={() => setNewTechnology("")} // Simplificado
                  name="NewTechnology"
                  type="text"
                  value={NewTechnology}
                />
                {errors.NewTechnology ? (
                  <label>{errors.NewTechnology}</label>
                ) : null}
                <button onClick={handleAddTechnology}>Agregar</button>
              </div>
              <div>
                <label>Categorias</label>
                <select onChange={handleChange} name="category">
                  <option>Seleccionar categorias</option>
                  {[...categories].sort().map((categ) => (
                    <option key={categ.id} value={categ.name}>
                      {categ.name}
                    </option>
                  ))}
                </select>
                <div>
                  {templateData.category.map((categ, index) => (
                    <div key={index}>
                      <p>{categ}</p>
                      <button onClick={handleRemove("category", categ)}>X</button>
                    </div>
                  ))}
                  {errors.category ? <label>{errors.category}</label> : null}
                </div>
                <label>Nueva Categoria</label>
                <input
                  onChange={(e) => setNewCategory(e.target.value)}
                  name="NewCategory"
                  type="text"
                  value={NewCategory}
                />
                {errors.NewCategory ? <label>{errors.NewCategory}</label> : null}
                <button onClick={handleAddCategory}>Agregar</button>
              </div>
            </div>
            <button type="submit" disabled= {handleDisable()}>Crear</button>
          </form>
        </div>
      );
    
};

export default CreateTemplate;