/**
 * Currency Formatter Utility
 * Handles USD and IDR formatting
 */

/**
 * Format currency based on currency code
 * @param {number} amount - The amount to format
 * @param {string} currency - 'USD' or 'IDR'
 * @param {boolean} includeDecimals - Whether to show decimals (default: true for USD, false for IDR)
 * @returns {string} Formatted currency string
 */
export function formatCurrency(amount, currency = 'USD', includeDecimals = null) {
  if (amount === null || amount === undefined) {
    return currency === 'USD' ? '$0.00' : 'IDR 0';
  }

  const numAmount = parseFloat(amount);

  if (isNaN(numAmount)) {
    return currency === 'USD' ? '$0.00' : 'IDR 0';
  }

  // Default decimals based on currency
  const showDecimals = includeDecimals !== null
    ? includeDecimals
    : (currency === 'USD');

  if (currency === 'USD') {
    // USD: $2,500.00 (with decimals) or $2,500 (without)
    return showDecimals
      ? `$${numAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
      : `$${numAmount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  } else if (currency === 'IDR') {
    // IDR: IDR 3,444,389 (no decimals)
    const formatted = Math.round(numAmount).toLocaleString('en-US');
    return `IDR ${formatted}`;
  } else {
    // Fallback for unknown currency
    return `${currency} ${numAmount.toLocaleString('en-US')}`;
  }
}

/**
 * Format large numbers with K/M abbreviations
 * @param {number} amount - The amount to abbreviate
 * @param {string} currency - 'USD' or 'IDR'
 * @returns {string} Abbreviated amount
 */
export function formatAbbreviated(amount, currency = 'USD') {
  const numAmount = parseFloat(amount);

  if (isNaN(numAmount)) {
    return '0';
  }

  if (currency === 'IDR') {
    // IDR uses millions (M)
    if (numAmount >= 1000000) {
      return `IDR ${(numAmount / 1000000).toFixed(1)}M`;
    } else if (numAmount >= 1000) {
      return `IDR ${(numAmount / 1000).toFixed(1)}K`;
    }
    return `IDR ${Math.round(numAmount)}`;
  } else {
    // USD uses K/M
    if (numAmount >= 1000000) {
      return `$${(numAmount / 1000000).toFixed(1)}M`;
    } else if (numAmount >= 1000) {
      return `$${(numAmount / 1000).toFixed(1)}K`;
    }
    return `$${numAmount.toFixed(2)}`;
  }
}

/**
 * Get currency symbol
 * @param {string} currency - 'USD' or 'IDR'
 * @returns {string} Currency symbol or code
 */
export function getCurrencySymbol(currency = 'USD') {
  return currency === 'USD' ? '$' : 'IDR';
}

/**
 * Format percentage
 * @param {number} value - The percentage value (0-100)
 * @param {number} decimals - Number of decimal places (default: 1)
 * @returns {string} Formatted percentage
 */
export function formatPercentage(value, decimals = 1) {
  if (value === null || value === undefined || isNaN(value)) {
    return '0%';
  }

  return `${parseFloat(value).toFixed(decimals)}%`;
}

/**
 * Convert IDR to USD approximate
 * Using rate: 1 USD = 16,000 IDR
 * @param {number} idrAmount - Amount in IDR
 * @returns {number} Approximate USD amount
 */
export function idrToUsd(idrAmount) {
  return idrAmount / 16000;
}

/**
 * Format number with commas
 * @param {number} num - The number to format
 * @returns {string} Formatted number
 */
export function formatNumber(num) {
  if (num === null || num === undefined || isNaN(num)) {
    return '0';
  }
  return parseFloat(num).toLocaleString('en-US');
}
