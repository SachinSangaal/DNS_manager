const AWS = require('../config/awsConfig');
const route53 = new AWS.Route53();

/**
 * Retrieves all hosted zones.
 * @returns {Promise<Array>} An array of hosted zones.
 */
const getHostedZones = async () => {
  try {
    const data = await route53.listHostedZones().promise();
    return data.HostedZones;
  } catch (error) {
    console.error('Error retrieving hosted zones:', error);
    throw error;
  }
};

/**
 * Retrieves records for a specified hosted zone.
 * @param {string} hostedZoneId - The ID of the hosted zone.
 * @returns {Promise<Array>} An array of records.
 */
const getRecords = async (hostedZoneId) => {
  try {
    const params = { HostedZoneId: hostedZoneId };
    const data = await route53.listResourceRecordSets(params).promise();
    return data.ResourceRecordSets;
  } catch (error) {
    console.error(`Error retrieving records for hosted zone ${hostedZoneId}:`, error);
    throw error;
  }
};

/**
 * Creates, updates, or deletes a DNS record.
 * @param {string} action - The action to perform (CREATE, UPSERT, DELETE).
 * @param {string} hostedZoneId - The ID of the hosted zone.
 * @param {Object} recordData - Data for the DNS record.
 * @returns {Promise<Object>} The response data from AWS.
 */
const manageRecord = async (action, hostedZoneId, recordData) => {
  try {
    console.log(`${action} record with data:`, recordData); 
    const params = {
      HostedZoneId: hostedZoneId,
      ChangeBatch: {
        Changes: [
          {
            Action: action,
            ResourceRecordSet: {
              Name: recordData.Name,
              Type: recordData.Type,
              TTL: recordData.TTL,
              ResourceRecords: recordData.ResourceRecords
            }
          }
        ]
      }
    };
    const data = await route53.changeResourceRecordSets(params).promise();
    return data;
  } catch (error) {
    console.error(`Error ${action.toLowerCase()}ing record:`, error);
    throw error;
  }
};

/**
 * Creates a DNS record.
 * @param {string} hostedZoneId - The ID of the hosted zone.
 * @param {Object} recordData - Data for the new record.
 * @returns {Promise<Object>} The response data from AWS.
 */
const createRecord = async (hostedZoneId, recordData) => {
  return manageRecord('CREATE', hostedZoneId, recordData);
};

/**
 * Updates a DNS record.
 * @param {string} hostedZoneId - The ID of the hosted zone.
 * @param {Object} recordData - Data for the record update.
 * @returns {Promise<Object>} The response data from AWS.
 */
const updateRecord = async (hostedZoneId, recordData) => {
  return manageRecord('UPSERT', hostedZoneId, recordData);
};

/**
 * Deletes a DNS record.
 * @param {string} hostedZoneId - The ID of the hosted zone.
 * @param {Object} recordData - Data for the record deletion.
 * @returns {Promise<Object>} The response data from AWS.
 */
const deleteRecord = async (hostedZoneId, recordData) => {
  return manageRecord('DELETE', hostedZoneId, recordData);
};

module.exports = {
  getHostedZones,
  getRecords,
  createRecord,
  updateRecord,
  deleteRecord
};
