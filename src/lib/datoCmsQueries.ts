export const GET_ALL_DATA_QUERY = `
  query GetAllData {
    allCategories(orderBy: pos_ASC) {
      id
      name
      pos
      slug
      items {
        id
        generalname
        name
        slug
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
      slug
      price
      priceDiscount
      cat {
      id
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
      code
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

export const GET_ALL_CATEGORIES_QUERY = `
  query GetAllData {
    allCategories {
      id
      name
      pos
      slug
      image {
        alt
        url
      }
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

    shownOnAddons: allItems(filter: { showonaddons: { eq: "true" } }) {
      id
      preorder
      preordertext
      coloropts {
        color
        code
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

export const GET_CATEGORIES_BY_SLUGS_QUERY = `
  query GetAllData($categories: [String!]!) {
    selectedCategories: allCategories(
      filter: { slug: { in: $categories } }
      orderBy: pos_ASC
    ) {
      id
      name
      pos
      slug
      image {
        alt
        url
      }
      items {
        id
        generalname
        name
        slug
        price
        priceDiscount
        newItem
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

    allCategories: allCategories(orderBy: pos_ASC) {
      id
      name
      pos
      slug
    }

    shownOnAddons: allItems(filter: { showonaddons: { eq: "true" } }) {
      id
      preorder
      preordertext
      coloropts {
        color
        code
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

export const GET_ITEM_BY_SLUG_QUERY = `
  query GetItemBySlug($slug: String!) {
    allItems(filter: { slug: { eq: $slug } }, first: 1) {
      id
      generalname
      name
      seoTitle
      seoDescription
      seoImage {
      url
        }
      slug
      price
      priceDiscount
      description
      manual
      driver
      video {
        url
      }
      newItem
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

    shownOnAddons: allItems(filter: { showonaddons: { eq: "true" } }) {
      id
      preorder
      preordertext
      coloropts {
        color
        code
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

      allCategories(orderBy: pos_ASC) {
      id
      name
      pos
      items {
        id
        generalname
        name
        slug
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
      
  }
`;
