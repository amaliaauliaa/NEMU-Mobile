# NEMU - Lost & Found for UMM Students

**NEMU** is a mobile **lost and found** application specifically designed for students of Universitas Muhammadiyah Malang (UMM). The application helps students report lost or found items around campus, making it easier for items to be returned to their owners.

This project was created as an assessment assignment for the **Mobile Programming** course (Informatics Laboratory, UMM).

## Background

Items left behind on campus, such as wallets, phones, keys, student ID cards, bags, and other belongings, can be difficult to return to their owners. Information is often shared through group chats or WhatsApp statuses, making it easy to get lost and difficult to track. NEMU provides a dedicated platform for recording and searching for lost and found items.

## Objectives

- Make it easier for students to report lost or found items.
- Provide search and filter features to help users find items more easily.
- Connect item owners and finders directly.
- Clearly display the status of an item, from lost to returned to its owner.

## Planned Features

| Feature                  | Description                                                                                                                                     |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| **Report an Item**       | Students fill out a report form including the report type (lost or found), item name, description, category, location, and contact information. |
| **Search Items**         | Display a list of all reports with a search field based on the item name.                                                                       |
| **Filter**               | Filter items by category (Wallet, Phone, Keys, Bag, Documents, Other) and campus location (building, library, cafeteria, mosque, parking area). |
| **Item Details**         | Display complete information including the item name, status, category, location, date, description, and reporter.                              |
| **Contact Owner/Finder** | A button that opens WhatsApp to contact the reporter with a pre-filled message.                                                                 |
| **Item Status**          | Three statuses: **Lost**, **Found**, and **Returned**. The status can be updated from the item details page.                                    |

### Planned Pages

1. **Home**: Displays item cards, a search field, category and location filter chips, and a **+ Report Item** button. Each card shows the item name, status, category, location, and date.

2. **Report Item**: A form for submitting an item report with validation for required fields.

3. **Item Details**: Displays complete item information, a contact button, and status settings.

## How to Run

```bash
git clone https://github.com/amaliaauliaa/NEMU-Mobile.git

cd NEMU-Mobile

npm install

npx expo start
```

Scan the QR code using the **Expo Go** application on your phone. Make sure your laptop and phone are connected to the same Wi-Fi network.

If you experience connection issues, use:

```bash
npx expo start --clear --tunnel
```

## Group Members

| Name                  | Role |
| --------------------- | ---- |
| Farel Faiza           | -    |
| Ani Seila Nanda Putri | -    |
| Amalia Sanyoto        | -    |

## Note

This application is an educational project and is not officially affiliated with Universitas Muhammadiyah Malang.
