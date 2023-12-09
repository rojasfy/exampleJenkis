const homeSaucePage = require("../../POM/sauceDemo/homeSaucePage");
const { shoppingCartPage } = require("../../POM/sauceDemo/shoppingCartPage");
const dataTest = require("../../fixtures/loging.json");

describe("SwagLabs | SCP | Agregar producto al carrito de compras desde el PLP o PDP", () => {
  beforeEach(
    "Precondición: Usuario debe haber iniciado sesión correctamente y aún no tener  agregado productos en el SC.",
    () => {
      cy.visit("/");
      cy.url().should("contain", "saucedemo");
      homeSaucePage.typeUsername(dataTest.datosValidos[0].username);
      homeSaucePage.typePassword(dataTest.datosValidos[0].password);
      homeSaucePage.clickLogin();
      cy.url().should("contain", dataTest.endPoint[0]);
      shoppingCartPage.btnLength()
      shoppingCartPage.filterBtnPlp("Add to cart").then(($btn) => {
        expect($btn).to.equal(Cypress.env("BtnLg"));
      });
      shoppingCartPage.elements.shoppingCartBadge().should("not.exist");
    }
  );

  it("26150 | TC1: Validar agregar productos desde el PLP al Shopping-cart exitosamente", () => {
    shoppingCartPage.elements
      .headerSecondaryTitle()
      .should("have.text", "Products");
    homeSaucePage.elements.itemsContainer().should("be.visible");

    for (let itemsCount = 0; itemsCount < dataTest.itemsProd[1]; itemsCount++) {
      shoppingCartPage.addToCartItemRandomPlp(); // selecionar productos al azar

      // validacion de cambio en el valor del boton "Add to cart" a "Remove"

      shoppingCartPage.filterBtnPlp("Remove").then(($btn) => {
        expect($btn).to.equal(itemsCount + 1);
      });

      if (Cypress.env("BtnLg") - (itemsCount + 1) !== 0) {
        shoppingCartPage.filterBtnPlp("Add to cart").then(($btn) => {
          expect($btn).to.equal(Cypress.env("BtnLg") - (itemsCount + 1));
        });
      } else {
        cy.log(
          "No existen productos disponibles para agregar al Shopping-cart"
        );
      }

      shoppingCartPage
        .detailsPlpRem(itemsCount, dataTest.valueClass[0].plp[1])
        .then((val) => {
          expect(val).to.equal(
            Cypress.env("productDetailsPlp").description[itemsCount]
          );
        });
      shoppingCartPage
        .detailsPlpRem(itemsCount, dataTest.valueClass[0].plp[2])
        .then((val) => {
          expect(val).to.equal(
            Cypress.env("productDetailsPlp").price[itemsCount]
          );
        });

      // validacion del incremento en el valor mostrado por el icono del shoppingCart

      shoppingCartPage.elements
        .shoppingCartBadge()
        .should("be.visible")
        .invoke("text")
        .and("contain", itemsCount + 1);

      // validacion de productos agregados shoppingCart vs productos seleccionados en el PLP

      shoppingCartPage.gotoShoppingCart();
      cy.url().should("contain", dataTest.endPoint[1]);
      shoppingCartPage.elements
        .headerSecondaryTitle()
        .should("have.text", "Your Cart");

      shoppingCartPage
        .detailsProdCar(itemsCount, dataTest.valueClass[1].cart[0])
        .then((val) => {
          expect(val).to.equal(
            Cypress.env("productDetailsPlp").title[itemsCount]
          );
        });
      shoppingCartPage
        .detailsProdCar(itemsCount, dataTest.valueClass[1].cart[1])
        .then((val) => {
          expect(val).to.equal(
            Cypress.env("productDetailsPlp").description[itemsCount]
          );
        });
      shoppingCartPage
        .detailsProdCar(itemsCount, dataTest.valueClass[1].cart[2])
        .then((val) => {
          expect(val).to.equal(
            Cypress.env("productDetailsPlp").price[itemsCount]
          );
        });
      shoppingCartPage.backShopping();
    }
  });

  it("26150 | TC2: Validar agregar productos desde el PDP al Shopping-cart exitosamente", () => {
    shoppingCartPage.deleteProduct();
    for (let itemsCount = 0; itemsCount < dataTest.itemsProd[1]; itemsCount++) {
      shoppingCartPage.selectProduct();
      cy.url().should("contain", dataTest.endPoint[5]);
      shoppingCartPage.textBtnPdp().then((val) => {
        expect(val).to.equal("Add to cart");
      });
      shoppingCartPage.addToCartPdp();

      shoppingCartPage.textBtnPdp().then((val) => {
        expect(val).to.equal("Remove");
      });
      shoppingCartPage.elements
        .shoppingCartBadge()
        .should("be.visible")
        .invoke("text")
        .and("contain", itemsCount + 1);

      shoppingCartPage.gotoShoppingCart();
      cy.url().should("contain", dataTest.endPoint[1]);
      shoppingCartPage.elements
        .headerSecondaryTitle()
        .should("have.text", "Your Cart");

      shoppingCartPage
        .detailsProdCar(itemsCount, dataTest.valueClass[1].cart[0])
        .then((val) => {
          expect(val).to.equal(
            Cypress.env("productDetailsPdp").title[itemsCount]
          );
        });
      shoppingCartPage
        .detailsProdCar(itemsCount, dataTest.valueClass[1].cart[1])
        .then((val) => {
          expect(val).to.equal(
            Cypress.env("productDetailsPdp").description[itemsCount]
          );
        });
      shoppingCartPage
        .detailsProdCar(itemsCount, dataTest.valueClass[1].cart[2])
        .then((val) => {
          expect(val).to.equal(
            Cypress.env("productDetailsPdp").price[itemsCount]
          );
        });
      shoppingCartPage.backShopping();
    }
  });

  it("26150 | TC3: Validar utilidad del boton 'Back to products' durante el proceso de agregar productos desde el PDP al Shopping-cart exitosamente ", () => {
    shoppingCartPage.deleteProduct();
    for (let itemsCount = 0; itemsCount < dataTest.itemsProd[0]; itemsCount++) {
      shoppingCartPage.selectProduct();
      cy.url().should("contain", dataTest.endPoint[5]);
      shoppingCartPage.textBtnPdp().then((val) => {
        expect(val).to.equal("Add to cart");
      });
      shoppingCartPage.addToCartPdp();
      shoppingCartPage.textBtnPdp().then((val) => {
        expect(val).to.equal("Remove");
      });
      shoppingCartPage.elements
        .shoppingCartBadge()
        .should("be.visible")
        .invoke("text")
        .and("contain", itemsCount + 1);
      shoppingCartPage.backToProducts();
      shoppingCartPage.gotoShoppingCart();
      cy.url().should("contain", dataTest.endPoint[1]);
      shoppingCartPage.elements
        .headerSecondaryTitle()
        .should("have.text", "Your Cart");

      shoppingCartPage
        .detailsProdCar(itemsCount, dataTest.valueClass[1].cart[0])
        .then((val) => {
          expect(val).to.equal(
            Cypress.env("productDetailsPdp").title[itemsCount]
          );
        });
      shoppingCartPage
        .detailsProdCar(itemsCount, dataTest.valueClass[1].cart[1])
        .then((val) => {
          expect(val).to.equal(
            Cypress.env("productDetailsPdp").description[itemsCount]
          );
        });
      shoppingCartPage
        .detailsProdCar(itemsCount, dataTest.valueClass[1].cart[2])
        .then((val) => {
          expect(val).to.equal(
            Cypress.env("productDetailsPdp").price[itemsCount]
          );
        });
      shoppingCartPage.backShopping();
    }
  });
});
