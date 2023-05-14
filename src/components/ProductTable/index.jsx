import React from 'react';
import { useTable } from 'react-table';
import P from 'prop-types';
import './styles.css';

export const ProductTable = ({ products }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Código</th>
          <th>Nome</th>
          <th>Preço Atual</th>
          <th>Novo Preço</th>
          <th>Observação</th>
        </tr>
      </thead>
      <tbody>
        {products.map((product) => {
          return (
            <tr
              key={product.code}
              className={
                product.errorMessage === 'Produto inexistente'
                  ? 'error'
                  : product.errorMessage !== 'Válido' && product.errorMessage !== 'Produto inexistente'
                  ? 'warning'
                  : 'success'
              }
            >
              <td>{product.code}</td>
              <td>{product.name}</td>
              <td>{product.sales_price}</td>
              <td>{product.newPrice}</td>
              <td>{product.errorMessage}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

ProductTable.propTypes = {
  products: P.any,
};
