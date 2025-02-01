export const ALL_ITEMS_QUERY = `
  query AllItems {
    allCategories {
      name
      items {
        id
        generalname
        name
        price
        priceDiscount
        showonaddons
        showonmain
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
  }
`;

export const SHOWN_ON_MAIN_PRODUCTS = `query MyQuery {
  allItems(filter: {showonmain: {eq: "true"}}) {
    id
    name
    priceDiscount
    coloropts {
      photos {
        url
      }
    }
  }
}`;
