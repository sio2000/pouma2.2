/**
 * Privacy Policy + Terms content (GDPR-aligned), bilingual.
 *
 * Note for the business owner: review with legal counsel and fill any
 * company-specific details (legal entity name, registered address, VAT) where
 * marked. Contact details default to the public contact email.
 */

import { siteConfig } from "@/lib/seo";

export interface LegalSection {
  heading: string;
  body?: string[];
  bullets?: string[];
}

export interface LegalContent {
  title: string;
  subtitle: string;
  updatedLabel: string;
  updated: string;
  sections: LegalSection[];
}

const EMAIL = siteConfig.email;
const BRAND = siteConfig.name;

const EL: LegalContent = {
  title: "Πολιτική Απορρήτου & Όροι",
  subtitle:
    "Πώς συλλέγουμε, χρησιμοποιούμε και προστατεύουμε τα προσωπικά σου δεδομένα, σύμφωνα με τον Γενικό Κανονισμό Προστασίας Δεδομένων (GDPR – ΕΕ 2016/679).",
  updatedLabel: "Τελευταία ενημέρωση",
  updated: "23 Ιουνίου 2026",
  sections: [
    {
      heading: "1. Υπεύθυνος Επεξεργασίας",
      body: [
        `Υπεύθυνος επεξεργασίας των προσωπικών σου δεδομένων είναι η ${BRAND} («εμείς», «μας»). Για οποιοδήποτε θέμα σχετικά με τα δεδομένα σου ή την παρούσα πολιτική, μπορείς να επικοινωνείς μαζί μας στο ${EMAIL}.`,
      ],
    },
    {
      heading: "2. Ποια δεδομένα συλλέγουμε",
      body: [
        "Συλλέγουμε μόνο τα δεδομένα που μας παρέχεις εσύ ή που είναι απολύτως απαραίτητα για τη λειτουργία της ιστοσελίδας:",
      ],
      bullets: [
        "Στοιχεία εγγραφής σε workshop: όνομα, επώνυμο, email, τηλέφωνο και (προαιρετικά) σχόλιο.",
        "Στοιχεία φόρμας επικοινωνίας: όνομα, email, μήνυμα.",
        "Στοιχεία συναίνεσης: η αποδοχή της πολιτικής και η χρονοσήμανση (ημερομηνία/ώρα) της συναίνεσης.",
        "Τεχνικά δεδομένα: διεύθυνση IP (για προστασία από κατάχρηση/spam) και βασικά στοιχεία περιήγησης μέσω του παρόχου φιλοξενίας.",
      ],
    },
    {
      heading: "3. Σκοποί & νομική βάση επεξεργασίας",
      body: [
        "Επεξεργαζόμαστε τα δεδομένα σου για τους εξής σκοπούς και με την αντίστοιχη νομική βάση:",
      ],
      bullets: [
        "Καταχώριση συμμετοχής σε workshop και αποστολή email επιβεβαίωσης — βάσει της συναίνεσής σου (άρθρο 6 παρ. 1α GDPR) και της εκτέλεσης της σχέσης συμμετοχής.",
        "Αποστολή, πριν την έναρξη, ενός δεύτερου email με τον σύνδεσμο παρακολούθησης — βάσει της ίδιας συναίνεσης/σχέσης.",
        "Απάντηση σε αιτήματα μέσω της φόρμας επικοινωνίας — βάσει συναίνεσης / εννόμου συμφέροντος.",
        "Ασφάλεια, αποτροπή κατάχρησης και τήρηση νομικών υποχρεώσεων — βάσει εννόμου συμφέροντος και νομικής υποχρέωσης.",
      ],
    },
    {
      heading: "4. Επικοινωνία μέσω email",
      body: [
        "Μετά την εγγραφή σου σε workshop λαμβάνεις email επιβεβαίωσης. Πριν την εκδήλωση, λαμβάνεις ένα δεύτερο email με τον σύνδεσμο παρακολούθησης. Δεν χρησιμοποιούμε τα στοιχεία σου για διαφημιστικά μηνύματα χωρίς ξεχωριστή συναίνεση.",
      ],
    },
    {
      heading: "5. Διατήρηση δεδομένων",
      body: [
        "Διατηρούμε τα δεδομένα σου για όσο διάστημα είναι απαραίτητο για τους παραπάνω σκοπούς και για εύλογο χρονικό διάστημα μετά την ολοκλήρωση του workshop, ώστε να τεκμηριώνεται η συμμετοχή και η συναίνεση. Μπορείς ανά πάσα στιγμή να ζητήσεις τη διαγραφή τους (βλ. ενότητα Δικαιώματα).",
      ],
    },
    {
      heading: "6. Αποδέκτες & εκτελούντες την επεξεργασία",
      body: [
        "Δεν πουλάμε και δεν εμπορευόμαστε τα δεδομένα σου. Τα μοιραζόμαστε μόνο με αξιόπιστους παρόχους υπηρεσιών που ενεργούν για λογαριασμό μας (εκτελούντες την επεξεργασία), αποκλειστικά για τη λειτουργία της υπηρεσίας:",
      ],
      bullets: [
        "Πάροχοι φιλοξενίας/βάσης δεδομένων (π.χ. Netlify, Supabase) για την αποθήκευση των εγγραφών.",
        "Πάροχος αποστολής email (π.χ. Resend / SMTP) για τα email επιβεβαίωσης και τον σύνδεσμο παρακολούθησης.",
        "Αρμόδιες αρχές, εφόσον απαιτείται από τον νόμο.",
      ],
    },
    {
      heading: "7. Διεθνείς διαβιβάσεις",
      body: [
        "Ορισμένοι πάροχοι ενδέχεται να επεξεργάζονται δεδομένα εκτός ΕΟΧ. Σε αυτές τις περιπτώσεις διασφαλίζουμε κατάλληλες εγγυήσεις (π.χ. Τυποποιημένες Συμβατικές Ρήτρες της ΕΕ), σύμφωνα με τον GDPR.",
      ],
    },
    {
      heading: "8. Cookies & τοπική αποθήκευση",
      body: [
        "Η ιστοσελίδα δεν χρησιμοποιεί διαφημιστικά cookies παρακολούθησης. Χρησιμοποιούμε την τοπική αποθήκευση (localStorage) του προγράμματος περιήγησής σου αποκλειστικά για λειτουργικούς λόγους — π.χ. για να θυμόμαστε αν έκλεισες το αναδυόμενο παράθυρο ή αν ολοκλήρωσες μια εγγραφή. Τα στοιχεία αυτά παραμένουν στη συσκευή σου.",
      ],
    },
    {
      heading: "9. Τα δικαιώματά σου (GDPR)",
      body: ["Σύμφωνα με τον GDPR, έχεις τα εξής δικαιώματα:"],
      bullets: [
        "Πρόσβαση στα δεδομένα σου.",
        "Διόρθωση ανακριβών ή ελλιπών δεδομένων.",
        "Διαγραφή («δικαίωμα στη λήθη»).",
        "Περιορισμό της επεξεργασίας.",
        "Φορητότητα των δεδομένων σου.",
        "Εναντίωση στην επεξεργασία.",
        "Ανάκληση της συναίνεσής σου ανά πάσα στιγμή, χωρίς να θίγεται η νομιμότητα της επεξεργασίας πριν την ανάκληση.",
      ],
    },
    {
      heading: "10. Δικαίωμα καταγγελίας",
      body: [
        `Για να ασκήσεις οποιοδήποτε δικαίωμα, επικοινώνησε μαζί μας στο ${EMAIL}. Έχεις επίσης το δικαίωμα υποβολής καταγγελίας στην Αρχή Προστασίας Δεδομένων Προσωπικού Χαρακτήρα (Λ. Κηφισίας 1-3, 115 23 Αθήνα, www.dpa.gr).`,
      ],
    },
    {
      heading: "11. Ασφάλεια",
      body: [
        "Εφαρμόζουμε κατάλληλα τεχνικά και οργανωτικά μέτρα για την προστασία των δεδομένων σου (κρυπτογραφημένη μεταφορά, περιορισμένη πρόσβαση, έλεγχοι εισόδου, προστασία από spam). Καμία μέθοδος δεν είναι απόλυτα ασφαλής, αλλά δεσμευόμαστε να προστατεύουμε τα δεδομένα σου με τη μέγιστη επιμέλεια.",
      ],
    },
    {
      heading: "12. Ανήλικοι",
      body: [
        "Οι υπηρεσίες μας απευθύνονται σε ενήλικες. Δεν συλλέγουμε εν γνώσει μας δεδομένα ανηλίκων χωρίς τη συναίνεση των γονέων/κηδεμόνων.",
      ],
    },
    {
      heading: "13. Όροι Συμμετοχής",
      body: [
        "Η εγγραφή σε workshop είναι προσωπική. Ο σύνδεσμος παρακολούθησης αποστέλλεται ατομικά και δεν επιτρέπεται η αναδιανομή του. Διατηρούμε το δικαίωμα να τροποποιήσουμε ημερομηνία/ώρα ή να ακυρώσουμε ένα workshop, ενημερώνοντάς σε εγκαίρως μέσω email.",
      ],
    },
    {
      heading: "14. Αλλαγές στην παρούσα πολιτική",
      body: [
        "Ενδέχεται να επικαιροποιούμε την παρούσα πολιτική. Κάθε σημαντική αλλαγή θα αναρτάται σε αυτή τη σελίδα με ενημερωμένη ημερομηνία.",
      ],
    },
    {
      heading: "15. Επικοινωνία",
      body: [
        `Για ερωτήσεις σχετικά με την παρούσα Πολιτική Απορρήτου ή τα δεδομένα σου, επικοινώνησε στο ${EMAIL}.`,
      ],
    },
  ],
};

const EN: LegalContent = {
  title: "Privacy Policy & Terms",
  subtitle:
    "How we collect, use and protect your personal data, in line with the General Data Protection Regulation (GDPR – EU 2016/679).",
  updatedLabel: "Last updated",
  updated: "23 June 2026",
  sections: [
    {
      heading: "1. Data Controller",
      body: [
        `The data controller for your personal data is ${BRAND} (“we”, “us”). For any matter regarding your data or this policy, contact us at ${EMAIL}.`,
      ],
    },
    {
      heading: "2. What data we collect",
      body: [
        "We only collect data you provide to us or that is strictly necessary to run the website:",
      ],
      bullets: [
        "Workshop registration details: first name, last name, email, phone and (optionally) a comment.",
        "Contact form details: name, email, message.",
        "Consent record: your acceptance of this policy and a timestamp of that consent.",
        "Technical data: IP address (for abuse/spam protection) and basic browsing data via our hosting provider.",
      ],
    },
    {
      heading: "3. Purposes & legal basis",
      body: ["We process your data for the following purposes and legal bases:"],
      bullets: [
        "Registering you for a workshop and sending a confirmation email — based on your consent (Art. 6(1)(a) GDPR) and the performance of the participation relationship.",
        "Sending a second email with the access link before the event — on the same basis.",
        "Responding to contact-form enquiries — based on consent / legitimate interest.",
        "Security, abuse prevention and legal compliance — based on legitimate interest and legal obligation.",
      ],
    },
    {
      heading: "4. Email communication",
      body: [
        "After registering you receive a confirmation email, and before the event a second email with the access link. We do not use your details for promotional messages without separate consent.",
      ],
    },
    {
      heading: "5. Data retention",
      body: [
        "We keep your data for as long as necessary for the purposes above and for a reasonable period after the workshop, to evidence participation and consent. You can request deletion at any time (see Your Rights).",
      ],
    },
    {
      heading: "6. Recipients & processors",
      body: [
        "We never sell or trade your data. We share it only with trusted service providers acting on our behalf (processors), solely to operate the service:",
      ],
      bullets: [
        "Hosting/database providers (e.g. Netlify, Supabase) to store registrations.",
        "Email delivery provider (e.g. Resend / SMTP) for confirmation emails and the access link.",
        "Competent authorities, where required by law.",
      ],
    },
    {
      heading: "7. International transfers",
      body: [
        "Some providers may process data outside the EEA. In such cases we ensure appropriate safeguards (e.g. EU Standard Contractual Clauses), in line with the GDPR.",
      ],
    },
    {
      heading: "8. Cookies & local storage",
      body: [
        "The website does not use advertising/tracking cookies. We use your browser's local storage strictly for functional reasons — e.g. to remember whether you dismissed the popup or completed a registration. This data stays on your device.",
      ],
    },
    {
      heading: "9. Your rights (GDPR)",
      body: ["Under the GDPR, you have the right to:"],
      bullets: [
        "Access your data.",
        "Rectify inaccurate or incomplete data.",
        "Erasure (“right to be forgotten”).",
        "Restrict processing.",
        "Data portability.",
        "Object to processing.",
        "Withdraw your consent at any time, without affecting the lawfulness of processing before withdrawal.",
      ],
    },
    {
      heading: "10. Right to complain",
      body: [
        `To exercise any right, contact us at ${EMAIL}. You also have the right to lodge a complaint with the Hellenic Data Protection Authority (1-3 Kifisias Ave., 115 23 Athens, Greece, www.dpa.gr).`,
      ],
    },
    {
      heading: "11. Security",
      body: [
        "We apply appropriate technical and organisational measures to protect your data (encrypted transfer, restricted access, access controls, spam protection). No method is fully secure, but we are committed to protecting your data with the utmost care.",
      ],
    },
    {
      heading: "12. Minors",
      body: [
        "Our services are intended for adults. We do not knowingly collect minors' data without parental/guardian consent.",
      ],
    },
    {
      heading: "13. Terms of participation",
      body: [
        "Workshop registration is personal. The access link is sent individually and must not be redistributed. We reserve the right to change the date/time or cancel a workshop, notifying you in good time by email.",
      ],
    },
    {
      heading: "14. Changes to this policy",
      body: [
        "We may update this policy. Any material change will be posted on this page with an updated date.",
      ],
    },
    {
      heading: "15. Contact",
      body: [
        `For questions about this Privacy Policy or your data, contact ${EMAIL}.`,
      ],
    },
  ],
};

export function getPrivacyContent(locale: string): LegalContent {
  return locale === "en" ? EN : EL;
}
