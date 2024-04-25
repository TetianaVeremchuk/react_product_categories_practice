/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useState } from "react";
import './App.scss';

import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

function findUser(userId) {
  return usersFromServer.find(user => user.id === userId);
}

function findCategory(categoryId) {
  return categoriesFromServer.find(category => category.id === categoryId);
}

const preparedProducts = productsFromServer.map(product => ({
  ...product,
  category: findCategory(product.categoryId),
  user: findUser(findCategory(product.categoryId).ownerId),
}));

function getProductsFiltered(inputProducts, selectedUser) {
  let filteredProducts = [...inputProducts];

  if (selectedUser) {
    filteredProducts = filteredProducts.filter(
      product => product.user.name === selectedUser.name,
    );
  }

  return filteredProducts;
}

export const App = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const handleUserSelect = user => setSelectedUser(user);
  const resetUserSelect = () => setSelectedUser(null);

  const readyProducts = getProductsFiltered(preparedProducts, selectedUser);

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <p className="panel-tabs has-text-weight-bold">
              <a
                data-cy="FilterAllUsers"
                href="#/"
                onClick={() => resetUserSelect()}
              >
                All
              </a>
              {usersFromServer.map(user => (
                <a
                  data-cy="FilterUser"
                  href="#/"
                  className={
                    selectedUser === user
                      ? 'is-active'
                      : ''
                  }
                  onClick={() => handleUserSelect(user)}
                  id={user.id}
                >
                  {user.name}
                </a>
              ))}
          </p>
          <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  data-cy="SearchField"
                  type="text"
                  className="input"
                  placeholder="Search"
                  value=""
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />

                </span>
                <span className="icon is-right">
                  {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}

                  <button
                    data-cy="ClearButton"
                    type="button"
                    className="delete"
                  />
                </span>
                </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                data-cy="AllCategories"
                className="button is-success mr-6 is-outlined is-active"
              >
                All
              </a>

              {categoriesFromServer.map(category => (
                <a
                  data-cy="Category"
                  className="button mr-2 my-1"
                  href="#/"
                >
                 {category.title}
                </a>
              ))}
            </div>

            <div className="panel-block">
              <a
                data-cy="ResetAllButton"
                href="#/"
                className="button is-link is-outlined is-fullwidth"
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">

          <table
            data-cy="ProductTable"
            className="table is-striped is-narrow is-fullwidth"
          >
            <thead>
              <tr>
                <th>
                  <span className="is-flex is-flex-wrap-nowrap">
                    ID
                    <a href="#/">
                      <span className="icon">
                        <i data-cy="SortIcon" className="fas fa-sort" />
                      </span>
                    </a>
                  </span>
                </th>

                <th>
                  <span className="is-flex is-flex-wrap-nowrap">
                    Product
                    <a href="#/">
                      <span className="icon">
                        <i data-cy="SortIcon" className="fas fa-sort-down" />
                      </span>
                    </a>
                  </span>
                </th>

                <th>
                  <span className="is-flex is-flex-wrap-nowrap">
                    Category
                    <a href="#/">
                      <span className="icon">
                        <i data-cy="SortIcon" className="fas fa-sort-up" />
                      </span>
                    </a>
                  </span>
                </th>

                <th>
                  <span className="is-flex is-flex-wrap-nowrap">
                    User
                    <a href="#/">
                      <span className="icon">
                        <i data-cy="SortIcon" className="fas fa-sort" />
                      </span>
                    </a>
                  </span>
                </th>
              </tr>
              </thead>

            <tbody>
              {readyProducts.map(preparedProduct => (
                <tr data-cy="Product">
                  <td className="has-text-weight-bold" data-cy="ProductId">
                    {preparedProduct.id}
                  </td>

                  <td data-cy="ProductName">
                    {preparedProduct.name}
                  </td>

                  <td data-cy="ProductCategory">
                    {preparedProduct.category.icon}
                    {' - '}
                    {preparedProduct.category.title}
                  </td>

                  <td
                    data-cy="ProductUser"
                    className={
                      preparedProduct.user.sex === 'm'
                        ? 'has-text-link'
                        : 'has-text-danger'
                    }
                  >
                    {preparedProduct.user.name}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </div>
    </div>
  );
};

