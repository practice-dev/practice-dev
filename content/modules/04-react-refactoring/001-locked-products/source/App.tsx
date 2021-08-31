import React from 'react';
import './styles.css';

interface Product {
  id: number;
  name: string;
  locked: boolean;
}

export function App() {
  const [products, setProducts] = React.useState<Product[]>([
    {
      id: 1,
      name: 'phone',
      locked: false,
    },
    {
      id: 2,
      name: 'tablet',
      locked: true,
    },
    {
      id: 3,
      name: 'pc',
      locked: true,
    },
    {
      id: 4,
      name: 'laptop',
      locked: false,
    },
  ]);
  const [deleteItem, setDeleteItem] = React.useState<Product | null>(null);
  const deleteModalRef = React.useRef<HTMLDivElement>(null);
  const lockedModalRef = React.useRef<HTMLDivElement>(null);
  const [isDeletingModal1, setIsDeletingModal1] = React.useState(false);
  const [isDeletingModal2, setIsDeletingModal2] = React.useState(false);
  return (
    <div>
      <h2>Locked products</h2>
      <ul>
        {products.map(product => (
          <li data-test="item" key={product.id}>
            <span data-test="name">
              {product.name}
              {product.locked ? ' (locked)' : ''}
            </span>
            <button
              className="delete-btn"
              data-test="delete-btn"
              onClick={() => {
                if (deleteModalRef.current) {
                  setDeleteItem(product);
                  deleteModalRef.current.classList.add('show');
                }
              }}
            >
              x
            </button>
          </li>
        ))}
      </ul>

      <div
        className="modal-wrapper"
        data-test="confirm-delete-modal"
        ref={deleteModalRef}
      >
        <div className="modal">
          <h3 data-test="modal-title">Are you sure?</h3>
          <p data-test="modal-description">
            Are you sure you want to delete the item "{deleteItem?.name}"?
          </p>
          <div className="buttons">
            <button
              data-test="modal-yes-btn"
              onClick={() => {
                if (deleteItem) {
                  if (deleteItem.locked) {
                    if (deleteModalRef.current) {
                      deleteModalRef.current.classList.remove('show');
                    }
                    if (lockedModalRef.current) {
                      lockedModalRef.current.classList.add('show');
                    }
                  } else {
                    setIsDeletingModal1(true);
                    setTimeout(() => {
                      const newProducts: Product[] = [];
                      for (let i = 0; i < products.length; i++) {
                        if (products[i] !== deleteItem) {
                          newProducts.push(products[i]);
                        }
                      }
                      setProducts(newProducts);
                      setIsDeletingModal1(false);
                      if (deleteModalRef.current) {
                        deleteModalRef.current.classList.remove('show');
                      }
                    }, 1000);
                  }
                }
              }}
              disabled={isDeletingModal1}
            >
              {isDeletingModal1 ? 'Deleting...' : 'Yes'}
            </button>
            <button
              data-test="modal-no-btn"
              disabled={isDeletingModal1}
              onClick={() => {
                if (deleteModalRef.current) {
                  deleteModalRef.current.classList.remove('show');
                }
              }}
            >
              No
            </button>
          </div>
        </div>
      </div>

      <div
        className="modal-wrapper"
        data-test="confirm-locked-modal"
        ref={lockedModalRef}
      >
        <div className="modal">
          <h3 data-test="modal-title">Item is locked!</h3>
          <p data-test="modal-description">
            Are you sure you want to delete the locked item "{deleteItem?.name}
            "?
          </p>
          <div className="buttons">
            <button
              data-test="modal-yes-btn"
              onClick={() => {
                setIsDeletingModal2(true);
                setTimeout(() => {
                  const newProducts: Product[] = [];
                  for (let i = 0; i < products.length; i++) {
                    if (products[i] !== deleteItem) {
                      newProducts.push(products[i]);
                    }
                  }
                  setProducts(newProducts);
                  setIsDeletingModal2(false);
                  if (lockedModalRef.current) {
                    lockedModalRef.current.classList.remove('show');
                  }
                }, 1000);
              }}
              disabled={isDeletingModal2}
            >
              {isDeletingModal2 ? 'Deleting...' : 'Yes'}
            </button>
            <button
              data-test="modal-no-btn"
              disabled={isDeletingModal2}
              onClick={() => {
                if (lockedModalRef.current) {
                  lockedModalRef.current.classList.remove('show');
                }
              }}
            >
              No
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
