export const GET_ALL_DATA_QUERY = `
  query GetAllData {
    allCategories {
      id
      name
      pos
      items {
        id
        generalname
        name
        price
        priceDiscount
        showonaddons
        showonmain
        preorder
        preordertext
        chars {
          name
          char
        }
        coloropts {
          code
          color
          colorset {
            hex
          }
          photos {
            alt
            url
          }
        }
        complect {
          name
          icon {
            url
            alt
          }
        }
      }
    }
    shownOnMainProducts: allItems(filter: { showonmain: { eq: "true" } }) {
      id
      name
      price
      priceDiscount
      cat {
      name
      }
      coloropts {
        photos {
          url
          alt
        }
      }
    }
  shownOnAddons: allItems(filter: {showonaddons: {eq: "true"}}) {
    id
    preorder
    preordertext
    coloropts {
      color
      photos {
        alt
        url
      }
    }
    generalname
    name
    price
    priceDiscount
  }
  }
`;

export const GET_PRODUCTS_BY_IDS = `query GetProductsByIds($ids:[ItemId]) {
  allItems(filter: { id: { in: $ids } }) {
    id
    price
    priceDiscount
  }
}`;

export const GET_PROMOCODE_BY_CODE = `query PromoByCode($code: String!) {
  allPromocodes(filter: { promocode: { eq: $code } }) {
    promocode
    discount
  }
}`;
