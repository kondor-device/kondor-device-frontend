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
