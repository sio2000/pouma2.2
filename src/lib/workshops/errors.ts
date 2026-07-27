/** Domain errors for the workshop system, mapped to HTTP statuses by routes. */

/** Thrown when an email is already registered for the same workshop. */
export class DuplicateRegistrationError extends Error {
  constructor(message = "Αυτό το email έχει ήδη δηλωθεί για το συγκεκριμένο workshop.") {
    super(message);
    this.name = "DuplicateRegistrationError";
  }
}

/** Thrown when a referenced workshop does not exist. */
export class WorkshopNotFoundError extends Error {
  constructor(message = "Το workshop δεν βρέθηκε.") {
    super(message);
    this.name = "WorkshopNotFoundError";
  }
}

/** Thrown when a slug collides with an existing workshop. */
export class SlugTakenError extends Error {
  constructor(message = "Υπάρχει ήδη workshop με αυτό το slug.") {
    super(message);
    this.name = "SlugTakenError";
  }
}
