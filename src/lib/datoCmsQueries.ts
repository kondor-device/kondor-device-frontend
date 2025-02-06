export const GET_ALL_DATA_QUERY = `
  query GetAllData {
    allCategories {
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
      coloropts {
        photos {
          url
          alt
        }
      }
    }
  shownOnAddons: allItems(filter: {showonaddons: {eq: "true"}}) {
    id
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
