import P from 'prop-types';
import { useContext, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import Papa from 'papaparse';
import { ProductTable } from '../ProductTable';
import { ErrorText } from '../ErrorText';
import { ProductsContext } from '../../contexts/ProductsProvider/context';
import { loadProducts } from '../../contexts/ProductsProvider/actions';
import { PacksContext } from '../../contexts/PacksProvider/context';
import { loadPacks } from '../../contexts/PacksProvider/actions';
import {
  getProduct,
  getProductsRelatedToPack,
  getSingleProductsRelatedToPack,
  packIdRelated,
  productIdRelated,
  updateProductPrices,
  validateErrors,
  validateProduct,
} from '../../utils/productUtils';

const styles = {
  button: {
    backgroundColor: 'blue',
    color: 'white',
    fontSize: '18px',
    padding: '10px',
    borderRadius: '5px',
    border: 'none',
    cursor: 'pointer',
    margin: '10px 0px',
    opacity: '1',
    pointerEvents: 'auto',
  },
  buttonDisabled: {
    backgroundColor: 'blue',
    color: 'white',
    fontSize: '18px',
    padding: '10px',
    borderRadius: '5px',
    border: 'none',
    cursor: 'pointer',
    margin: '10px 0px',
    opacity: '0.5',
    pointerEvents: 'none',
  },
  error: {
    color: 'red',
    fontSize: '16px',
    fontWeight: 'bold',
    margin: '10px 0px',
  },
};

export const CsvDownloadButton = ({ onButtonClicked, disabled = false }) => {
  const [file, setFile] = useState(null);
  const [data, setData] = useState(null);
  const [products, setProducts] = useState([]);
  const [isRead, setIsRead] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isValid, setIsValid] = useState(false);

  const isMounted = useRef(true);

  const port = process.env.PORT_SERVER || 5000;

  const productsContext = useContext(ProductsContext);
  const { productsState, productsDispatch } = productsContext;
  const packsContext = useContext(PacksContext);
  const { packsState, packsDispatch } = packsContext;
  useEffect(() => {
    loadProducts(productsDispatch).then((dispatch) => {
      if (isMounted.current) {
        dispatch();
      }
    });

    loadPacks(packsDispatch).then((dispatch) => {
      if (isMounted.current) {
        dispatch();
      }
    });

    return () => {
      //Limpando o isMounted para não executar a função dispatch em um unmounted component
      isMounted.current = false;
    };
  }, [productsDispatch, packsDispatch]);

  useEffect(() => {
    setIsLoaded(false);
    if (data != null) {
      setIsValid(false);
      const newProducts = [];
      let index = 0;
      for (const item of data) {
        if (item.product_code) {
          const product = getProduct(item.product_code, productsState);
          if (product) {
            product.newPrice = parseFloat(item.new_price);
            const packId = packIdRelated(product.code, packsState);
            if (packId > 0) {
              const productsRelated = getProductsRelatedToPack(packId, productsState, packsState);
              productsRelated.forEach((prod) => {
                newProducts.push(prod);
              });
            } else {
              const singleProductPackId = productIdRelated(product.code, packsState);
              if (singleProductPackId > 0) {
                const singleProduct = getSingleProductsRelatedToPack(
                  singleProductPackId,
                  product,
                  productsState,
                  packsState,
                );
                newProducts.push(singleProduct);
              }
              newProducts.push(product);
            }
          } else {
            newProducts.push({ code: item.product_code, errorMessage: 'Produto inexistente' });
          }
        }
        index++;
      }
      validateProduct(newProducts);
      setProducts(newProducts);
      setIsValid(validateErrors(newProducts));
      setIsLoaded(true);
    }
  }, [data, productsState, packsState, isValid]);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleProductsUpdate = () => {
    const dbProducts = transformProductsToDb();
    updateProducts(dbProducts);
  };

  const updateProducts = async (products) => {
    try {
      const response = await axios.post(`http://localhost:${port}/update-products`, { products });
      alert(response.data);
    } catch (error) {
      alert(error);
    }
  };

  const transformProductsToDb = () => {
    const dbProducts = [];
    products.forEach((prod) => {
      dbProducts.push({ code: prod.code, sales_price: prod.newPrice });
    });
    return dbProducts;
  };

  const handleFileUpload = async () => {
    const reader = new FileReader();

    reader.readAsText(file);

    reader.onload = () => {
      const fileReader = reader.result.split('\n');
      if (!fileReader[0].toString().includes('product_code')) {
        setErrorMessage('Arquivo sem product_code no cabeçalho. Ex de cabeçalho do arquivo: product_code,new_price');
        setError(true);
        return;
      }
      if (!fileReader[0].toString().includes('new_price')) {
        setErrorMessage('Arquivo sem new_price no cabeçalho. Ex de cabeçalho do arquivo: product_code,new_price');
        setError(true);
        return;
      }
      if (!fileReader[0].toString().includes('product_code,new_price')) {
        setErrorMessage(
          'Arquivo sem product_code seguido de new_price no cabeçalho. Ex de cabeçalho do arquivo: product_code,new_price',
        );
        setError(true);
        return;
      }
      setError(false);
    };

    reader.onerror = () => {
      setErrorMessage('erro ao ler o arquivo' + reader.error);
      setError(true);
      return;
    };
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        const filterArray = results.data.filter((element) => {
          return element['product_code,new_price'] !== '';
        });
        setIsRead(false);
        setData(filterArray);
      },
    });
  };

  const getPackQuantityByProductId = async (id) => {
    try {
      const response = await axios.get(`http://localhost:${port}/packs/${id}`);
      return response.data.qty;
    } catch (error) {
      return 1;
    }
  };
  return (
    <div>
      {isLoaded && <ProductTable products={products}></ProductTable>}
      {error && <ErrorText errorMessage={errorMessage} style={styles.error}></ErrorText>}
      <input type="file" accept=".csv" onChange={handleFileChange} />
      <button onClick={handleFileUpload} style={file ? styles.button : styles.buttonDisabled}>
        Validar
      </button>
      <button onClick={handleProductsUpdate} style={isValid ? styles.button : styles.buttonDisabled}>
        Atualizar
      </button>
    </div>
  );
};

CsvDownloadButton.propTypes = {
  onButtonClicked: P.func.isRequired,
  disabled: P.bool,
};
