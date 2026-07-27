/**
 * Bilingual UI copy for the public workshop experience (landing, popup, form,
 * thank-you). Workshop title/subtitle/description are admin-entered; everything
 * else — labels, marketing sections, FAQ — lives here, keyed by locale.
 */

export interface WorkshopBenefit {
  icon: string;
  title: string;
  text: string;
}

export interface WorkshopFaq {
  q: string;
  a: string;
}

export interface WorkshopContent {
  status: { upcoming: string; live: string; completed: string };
  hero: {
    startsIn: string;
    liveNow: string;
    endedNote: string;
    cta: string;
    dateLabel: string;
    timeLabel: string;
  };
  countdown: { days: string; hours: string; minutes: string; seconds: string };
  about: { eyebrow: string; title: string };
  benefits: { eyebrow: string; title: string; subtitle: string; items: WorkshopBenefit[] };
  learn: { eyebrow: string; title: string; subtitle: string; items: string[] };
  faq: { eyebrow: string; title: string; items: WorkshopFaq[] };
  cta: { title: string; text: string; button: string };
  register: {
    eyebrow: string;
    title: string;
    text: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    comment: string;
    optional: string;
    consent: string;
    consentLinkText: string;
    submit: string;
    submitting: string;
    closedTitle: string;
    closedText: string;
    completedTitle: string;
    completedText: string;
    errorGeneric: string;
    errorDuplicate: string;
    errorConsent: string;
  };
  popup: { eyebrow: string; cta: string; close: string };
  thankYou: {
    badge: string;
    title: string;
    line1: string;
    line2: string;
    line3: string;
    backHome: string;
    addCalendar: string;
    detailsTitle: string;
  };
}

const EL: WorkshopContent = {
  status: { upcoming: "Προσεχώς", live: "Σε εξέλιξη", completed: "Ολοκληρώθηκε" },
  hero: {
    startsIn: "Ξεκινά σε",
    liveNow: "Live τώρα",
    endedNote: "Αυτό το workshop έχει ολοκληρωθεί.",
    cta: "Συμμετοχή στο Workshop",
    dateLabel: "Ημερομηνία",
    timeLabel: "Ώρα",
  },
  countdown: { days: "Ημέρες", hours: "Ώρες", minutes: "Λεπτά", seconds: "Δευτ." },
  about: { eyebrow: "Σχετικά με το workshop", title: "Τι θα ζήσεις" },
  benefits: {
    eyebrow: "Γιατί να συμμετάσχεις",
    title: "Μια εμπειρία που αφήνει αποτύπωμα",
    subtitle: "Πρακτική γνώση, ζωντανή καθοδήγηση και εργαλεία που εφαρμόζεις από την επόμενη μέρα.",
    items: [
      {
        icon: "✦",
        title: "Ζωντανή καθοδήγηση",
        text: "Παρακολουθείς live, ρωτάς απευθείας και παίρνεις απαντήσεις στις δικές σου περιπτώσεις.",
      },
      {
        icon: "◆",
        title: "Πρακτικά εργαλεία",
        text: "Φεύγεις με συγκεκριμένα βήματα και templates που μπορείς να εφαρμόσεις αμέσως.",
      },
      {
        icon: "❖",
        title: "Μικρό, ζεστό group",
        text: "Ένα περιβάλλον που ενθαρρύνει την ερώτηση, την εξάσκηση και την πραγματική συμμετοχή.",
      },
      {
        icon: "✺",
        title: "Σύνδεσμος παρακολούθησης",
        text: "Λαμβάνεις τον προσωπικό σου σύνδεσμο με email, λίγο πριν την έναρξη.",
      },
    ],
  },
  learn: {
    eyebrow: "Το περιεχόμενο",
    title: "Τι θα μάθεις",
    subtitle: "Ένα δομημένο μονοπάτι από τη θεωρία στην εφαρμογή.",
    items: [
      "Τα θεμέλια που χρειάζεσαι για να ξεκινήσεις με σιγουριά.",
      "Τις τεχνικές που κάνουν τη διαφορά στην πράξη.",
      "Πώς να αποφεύγεις τα πιο συχνά λάθη.",
      "Ένα πλάνο εφαρμογής για τα επόμενα βήματά σου.",
    ],
  },
  faq: {
    eyebrow: "Συχνές ερωτήσεις",
    title: "Ό,τι χρειάζεται να ξέρεις",
    items: [
      {
        q: "Πώς θα παρακολουθήσω το workshop;",
        a: "Είναι online. Μετά την εγγραφή σου θα λάβεις email επιβεβαίωσης και, λίγο πριν την έναρξη, ένα δεύτερο email με τον σύνδεσμο παρακολούθησης.",
      },
      {
        q: "Χρειάζομαι κάτι ειδικό για να συμμετάσχω;",
        a: "Μόνο μια σταθερή σύνδεση στο internet και έναν υπολογιστή ή κινητό. Όλες οι οδηγίες θα είναι στο email σου.",
      },
      {
        q: "Θα υπάρχει δυνατότητα ερωτήσεων;",
        a: "Ναι. Το workshop είναι διαδραστικό — θα έχεις χρόνο να ρωτήσεις και να πάρεις απαντήσεις.",
      },
      {
        q: "Έκανα εγγραφή αλλά δεν έλαβα email;",
        a: "Έλεγξε τον φάκελο ανεπιθύμητων (spam). Αν δεν το βρεις, επικοινώνησε μαζί μας και θα το διορθώσουμε άμεσα.",
      },
    ],
  },
  cta: {
    title: "Είσαι έτοιμος/η;",
    text: "Κράτησε τη θέση σου τώρα — οι θέσεις είναι περιορισμένες.",
    button: "Συμμετοχή στο Workshop",
  },
  register: {
    eyebrow: "Εγγραφή",
    title: "Δήλωσε συμμετοχή",
    text: "Συμπλήρωσε τα στοιχεία σου και κράτησε τη θέση σου.",
    firstName: "Όνομα",
    lastName: "Επώνυμο",
    email: "Email",
    phone: "Τηλέφωνο",
    comment: "Σχόλιο",
    optional: "προαιρετικό",
    consent:
      "Συμφωνώ με την Πολιτική Απορρήτου και συναινώ στην επεξεργασία των προσωπικών μου δεδομένων αποκλειστικά για σκοπούς συμμετοχής και επικοινωνίας σχετικά με το συγκεκριμένο workshop.",
    consentLinkText: "Πολιτική Απορρήτου",
    submit: "Συμμετοχή στο Workshop",
    submitting: "Γίνεται εγγραφή…",
    closedTitle: "Οι εγγραφές είναι κλειστές",
    closedText: "Οι εγγραφές για αυτό το workshop δεν είναι αυτή τη στιγμή διαθέσιμες.",
    completedTitle: "Το workshop ολοκληρώθηκε",
    completedText: "Αυτό το workshop έχει ήδη πραγματοποιηθεί. Μείνε συντονισμένος/η για τα επόμενα.",
    errorGeneric: "Κάτι πήγε στραβά. Δοκίμασε ξανά.",
    errorDuplicate: "Αυτό το email έχει ήδη δηλωθεί για το συγκεκριμένο workshop.",
    errorConsent: "Παρακαλώ αποδέξου την Πολιτική Απορρήτου για να συνεχίσεις.",
  },
  popup: {
    eyebrow: "Επερχόμενο workshop",
    cta: "Συμμετοχή στο Workshop",
    close: "Κλείσιμο",
  },
  thankYou: {
    badge: "Επιτυχής εγγραφή",
    title: "Σε ευχαριστούμε!",
    line1: "Η συμμετοχή σας καταχωρήθηκε επιτυχώς.",
    line2: "Σας έχουμε αποστείλει email επιβεβαίωσης.",
    line3:
      "Πριν την έναρξη του workshop θα λάβετε δεύτερο email με τον σύνδεσμο παρακολούθησης.",
    backHome: "Επιστροφή στην αρχική",
    addCalendar: "Προσθήκη στο ημερολόγιο",
    detailsTitle: "Στοιχεία workshop",
  },
};

const EN: WorkshopContent = {
  status: { upcoming: "Upcoming", live: "Live", completed: "Completed" },
  hero: {
    startsIn: "Starts in",
    liveNow: "Live now",
    endedNote: "This workshop has ended.",
    cta: "Join the Workshop",
    dateLabel: "Date",
    timeLabel: "Time",
  },
  countdown: { days: "Days", hours: "Hours", minutes: "Min", seconds: "Sec" },
  about: { eyebrow: "About the workshop", title: "What you'll experience" },
  benefits: {
    eyebrow: "Why join",
    title: "An experience that sticks",
    subtitle: "Practical knowledge, live guidance and tools you can use the very next day.",
    items: [
      {
        icon: "✦",
        title: "Live guidance",
        text: "Attend live, ask directly and get answers tailored to your own case.",
      },
      {
        icon: "◆",
        title: "Practical tools",
        text: "Leave with concrete steps and templates you can apply right away.",
      },
      {
        icon: "❖",
        title: "Small, warm group",
        text: "An environment that invites questions, practice and genuine participation.",
      },
      {
        icon: "✺",
        title: "Access link",
        text: "You'll receive your personal link by email, shortly before we begin.",
      },
    ],
  },
  learn: {
    eyebrow: "The content",
    title: "What you'll learn",
    subtitle: "A structured path from theory to application.",
    items: [
      "The foundations you need to start with confidence.",
      "The techniques that make the difference in practice.",
      "How to avoid the most common mistakes.",
      "An action plan for your next steps.",
    ],
  },
  faq: {
    eyebrow: "FAQ",
    title: "Everything you need to know",
    items: [
      {
        q: "How will I attend the workshop?",
        a: "It's online. After registering you'll get a confirmation email and, shortly before it starts, a second email with your access link.",
      },
      {
        q: "Do I need anything special to join?",
        a: "Just a stable internet connection and a computer or phone. All instructions will be in your email.",
      },
      {
        q: "Will there be a chance to ask questions?",
        a: "Yes. The workshop is interactive — you'll have time to ask and get answers.",
      },
      {
        q: "I registered but didn't get an email?",
        a: "Check your spam folder. If you can't find it, contact us and we'll fix it right away.",
      },
    ],
  },
  cta: {
    title: "Ready to join?",
    text: "Save your seat now — places are limited.",
    button: "Join the Workshop",
  },
  register: {
    eyebrow: "Registration",
    title: "Register now",
    text: "Fill in your details and save your spot.",
    firstName: "First name",
    lastName: "Last name",
    email: "Email",
    phone: "Phone",
    comment: "Comment",
    optional: "optional",
    consent:
      "I agree to the Privacy Policy and consent to the processing of my personal data solely for the purpose of participating in and communicating about this specific workshop.",
    consentLinkText: "Privacy Policy",
    submit: "Join the Workshop",
    submitting: "Registering…",
    closedTitle: "Registration is closed",
    closedText: "Registration for this workshop is not available at the moment.",
    completedTitle: "Workshop completed",
    completedText: "This workshop has already taken place. Stay tuned for the next ones.",
    errorGeneric: "Something went wrong. Please try again.",
    errorDuplicate: "This email is already registered for this workshop.",
    errorConsent: "Please accept the Privacy Policy to continue.",
  },
  popup: {
    eyebrow: "Upcoming workshop",
    cta: "Join the Workshop",
    close: "Close",
  },
  thankYou: {
    badge: "Registration successful",
    title: "Thank you!",
    line1: "Your registration was completed successfully.",
    line2: "We've sent you a confirmation email.",
    line3: "Before the workshop starts you'll receive a second email with the access link.",
    backHome: "Back to home",
    addCalendar: "Add to calendar",
    detailsTitle: "Workshop details",
  },
};

export function getWorkshopContent(locale: string): WorkshopContent {
  return locale === "en" ? EN : EL;
}
