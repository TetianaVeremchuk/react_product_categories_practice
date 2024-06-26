/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useState } from 'react';
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

const preperedProducts = productsFromServer.map(product => ({
  ...product,
  category: findCategory(product.categoryId),
  user: findUser(findCategory(product.categoryId).ownerId),
}));

function getProductsFiltered(inputProducts, selectedUser, query) {
  let filteredProducts = [...inputProducts];

  if (selectedUser) {
    filteredProducts = filteredProducts.filter(
      product => product.user.name === selectedUser.name,
    );
  }

  if (query) {
    filteredProducts = filteredProducts.filter(product =>
      product.name.toLowerCase().includes(query),
    );
  }

  return filteredProducts;
}

export const App = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [query, setQuery] = useState('');

  const prepareQuery = inputQuery => {
    const pureQuery = inputQuery.trim().toLowerCase();

    setQuery(pureQuery);
  };

  const handleUserSelect = user => setSelectedUser(user);
  const resetUserSelect = () => setSelectedUser(null);

  const resetQuery = () => setQuery('');

  const readyProducts = getProductsFiltered(
    preperedProducts,
    selectedUser,
    query,
  );

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
                className={selectedUser === null ? 'is-active' : ''}
                onClick={() => resetUserSelect()}
              >
                All
              </a>
              {usersFromServer.map(user => (
                <a
                  data-cy="FilterUser"
                  href="#/"
                  className={selectedUser === user ? 'is-active' : ''}
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
                  value={query}
                  onChange={event => prepareQuery(event.target.value)}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                {query && (
                  <span className="icon is-right">
                    {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                    <button
                      data-cy="ClearButton"
                      type="button"
                      className="delete"
                      onClick={() => resetQuery()}
                    />
                  </span>
                )}
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
                <a data-cy="Category" className="button mr-2 my-1" href="#/">
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
            {readyProducts.length > 0 && (
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
            )}

            <tbody>
              {readyProducts.length === 0 && (
                <tr>
                  <td colSpan="4">
                    <p data-cy="NoMatchingMessage">
                      No products matching selected criteria
                    </p>
                  </td>
                </tr>
              )}
              {readyProducts.length > 0 &&
                readyProducts.map(preparedProduct => (
                  <tr data-cy="Product" key={preparedProduct.id}>
                    <td className="has-text-weight-bold" data-cy="ProductId">
                      {preparedProduct.id}
                    </td>

                    <td data-cy="ProductName">{preparedProduct.name}</td>

                    <td data-cy="ProductCategory">
                      {preparedProduct.category.icon} {' - '}
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
