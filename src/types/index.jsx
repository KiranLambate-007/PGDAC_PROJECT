/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} email
 * @property {string} name
 * @property {string} phone
 */

/**
 * @typedef {Object} Route
 * @property {string} id
 * @property {string} origin
 * @property {string} destination
 * @property {string} distance
 * @property {string} duration
 * @property {number} price
 */

/**
 * @typedef {Object} Bus
 * @property {string} id
 * @property {string} routeId
 * @property {string} busNumber
 * @property {string} departureTime
 * @property {string} arrivalTime
 * @property {number} availableSeats
 * @property {number} totalSeats
 * @property {'Standard' | 'Premium' | 'Luxury'} busType
 */

/**
 * @typedef {Object} Seat
 * @property {string} id
 * @property {string} seatNumber
 * @property {boolean} isOccupied
 * @property {number} price
 */

/**
 * @typedef {Object} Ticket
 * @property {string} id
 * @property {string} userId
 * @property {string} routeId
 * @property {string} busId
 * @property {string[]} seatNumbers
 * @property {string[]} qrCodes
 * @property {'active' | 'postponed' | 'cancelled' | 'transferred'} status
 * @property {string} bookingDate
 * @property {string} travelDate
 * @property {number} totalAmount
 * @property {'pending' | 'completed' | 'refunded'} paymentStatus
 */

/**
 * @typedef {Object} PaymentDetails
 * @property {number} amount
 * @property {'card' | 'mobile' | 'bank'} method
 * @property {string} [cardNumber]
 * @property {string} [expiryDate]
 * @property {string} [cvv]
 */
