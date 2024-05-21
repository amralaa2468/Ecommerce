import { gql } from "@apollo/client";

export const getCountries = gql`
  query getCountries($search: String) {
    getCountries(search: $search) {
      _id
      name
      nameInArabic
    }
  }
`;

export const getSpecifiedCities = gql`
  query getSpecifiedCities($countryId: String!, $storeId: String!) {
    getSpecifiedCities(countryId: $countryId, storeId: $storeId) {
      _id
      name
      nameInArabic
      stateInfo {
        _id
        name
        nameInArabic
      }
    }
  }
`;

export const getStorePickupLocations = gql`
  query getStorePickupLocations($storeId: String!) {
    getStorePickupLocations(storeId: $storeId) {
      _id
      storeName
      countryId
      cityId
      stateId
      block
      street
      avenue
      building
      deliverToStateIds
      type
      phoneNumber
      additionalDetails
    }
  }
`;

export const getStateIdToLocationId = gql`
  query stateIdToLocationId($storeId: String!, $stateId: String!) {
    stateIdToLocationId(storeId: $storeId, stateId: $stateId) {
      message
    }
  }
`;
