import Papa from 'papaparse';
import axios from 'axios';

export const parseCsvFile = async (file) => {
  const response = await axios.get(file);
  const csvData = Papa.parse(response.data, { header: true }).data;
  const products = csvData.map((row) => ({
    id: parseInt(row.id),
    newPrice: parseFloat(row.newPrice),
  }));
  return products;
};

export const updateProductPrices = (products, productData) => {
  products.forEach((prod) => {
    const product = productData.find((p) => p.code === prod.id);
    if (!product) {
      prod.errorMessage = 'Produto inexistente';
    } else if (prod.newPrice < product.cost_price) {
      prod.errorMessage = 'Produto com valor menor que o seu custo';
    } else if (prod.newPrice > product.sales_price * 1.1) {
      prod.errorMessage = 'Produto com valor maior que 10% do antigo valor';
    } else if (prod.newPrice < product.sales_price * 0.9) {
      prod.errorMessage = 'Produto com valor menor que 10% do antigo valor';
    } else {
      prod.errorMessage = 'Válido';
    }
    prod.sales_price = product.sales_price;
    prod.cost_price = product.cost_price;
  });
  return products;
};

export const validateProduct = (products) => {
  products.forEach((prod) => {
    if (prod.errorMessage == 'Produto inexistente') {
      return;
    }
    if (prod.cost_price > prod.newPrice) {
      prod.errorMessage = 'Produto com valor menor que o seu custo';
      return;
    }
    if (prod.newPrice > prod.sales_price + prod.sales_price * 0.1) {
      prod.errorMessage = 'Produto com valor maior que 10% do antigo valor';
      return;
    }
    if (prod.newPrice < prod.sales_price - prod.sales_price * 0.1) {
      prod.errorMessage = 'Produto com valor menor que 10% do antigo valor';
      return;
    }
    prod.errorMessage = 'Válido';
  });
};

export const validateErrors = (products) => {
  let boolean = true;
  if (!products || products.length == 0) {
    return false;
  }
  for (let i = 0; i < products.length; i++) {
    if (products[i].errorMessage !== 'Válido') {
      boolean = false;
      break;
    }
  }
  return boolean;
};

export const getProduct = (id, productsState) => {
  return productsState.products.filter((element) => {
    return element.code === parseInt(id);
  })[0];
};

export const packIdRelated = (id, packsState) => {
  let packId = 0;
  packsState.packs.forEach((element) => {
    if (element.product_id == id) {
      packId = element.pack_id;
    }
  });
  return packId;
};

export const getProductsRelatedToPack = (id, productsState, packsState) => {
  const products = [];
  let newPackProductPrice = 0;
  packsState.packs.forEach((pack) => {
    if (id == pack.pack_id) {
      const packContentProduct = getProduct(pack.product_id, productsState);
      if (!packContentProduct.newPrice) {
        packContentProduct.newPrice = packContentProduct.sales_price;
      }
      newPackProductPrice += packContentProduct.newPrice * parseFloat(pack.qty);
      products.push(packContentProduct);
    }
  });
  const packProduct = getProduct(id, productsState);
  packProduct.newPrice = newPackProductPrice;
  products.push(packProduct);
  return products;
};

export const getSingleProductsRelatedToPack = (id, fatherProduct, productsState, packsState) => {
  const packProduct = getProduct(id, productsState);
  for (let i = 0; i < packsState.packs.length; i++) {
    if (id == parseInt(packsState.packs[i].product_id)) {
      packProduct.newPrice = fatherProduct.newPrice / parseFloat(packsState.packs[i].qty);
      break;
    }
  }
  return packProduct;
};

export const productIdRelated = (id, packsState) => {
  let productId = 0;
  packsState.packs.forEach((element) => {
    if (element.pack_id == id) {
      productId = element.product_id;
    }
  });
  return productId;
};
