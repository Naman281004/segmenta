// convex/seed.js
import { mutation } from "./_generated/server";

/**
 * Seed database with dummy data using your existing users
 * Run with: npx convex run seed:seedDatabase
 */
export const seedDatabase = mutation({
  args: {},
  handler: async (ctx) => {
    // Clear existing data (except users)
    const existingGroups = await ctx.db.query("groups").collect();
    for (const group of existingGroups) {
      await ctx.db.delete(group._id);
    }
    const existingExpenses = await ctx.db.query("expenses").collect();
    for (const expense of existingExpenses) {
      await ctx.db.delete(expense._id);
    }
    const existingSettlements = await ctx.db.query("settlements").collect();
    for (const settlement of existingSettlements) {
      await ctx.db.delete(settlement._id);
    }

    // Step 1: Get your existing users
    const users = await ctx.db.query("users").collect();

    if (users.length < 4) {
      console.log(
        "Not enough users in the database. Please ensure you have at least 4 users."
      );
      return {
        skipped: true,
        reason: "Not enough users",
      };
    }

    // Step 2: Create groups
    const groups = await createGroups(ctx, users);

    // Step 3: Create 1-on-1 expenses
    const oneOnOneExpenses = await createOneOnOneExpenses(ctx, users);

    // Step 4: Create group expenses
    const groupExpenses = await createGroupExpenses(ctx, users, groups);

    // Step 5: Create settlements
    const settlements = await createSettlements(
      ctx,
      users,
      groups,
      oneOnOneExpenses,
      groupExpenses
    );

    return {
      success: true,
      stats: {
        users: users.length,
        groups: groups.length,
        oneOnOneExpenses: oneOnOneExpenses.length,
        groupExpenses: groupExpenses.length,
        settlements: settlements.length,
      },
    };
  },
});

// Helper function to get a random date in the past `monthsAgo` months
function getRandomDate(monthsAgo) {
  const now = new Date();
  const from = new Date();
  from.setMonth(from.getMonth() - monthsAgo);

  return new Date(
    from.getTime() + Math.random() * (now.getTime() - from.getTime()),
  ).getTime();
}

// Helper to create groups
async function createGroups(ctx, users) {
  const now = Date.now();

  // Using the users from your database
  const user1 = users[0];
  const user2 = users[1];
  const user3 = users[2];
  const user4 = users[3];

  const groupDatas = [
    {
      name: "Weekend Trip",
      description: "Expenses for our weekend getaway",
      createdBy: user1._id,
      members: [
        { userId: user1._id, role: "admin", joinedAt: now },
        { userId: user2._id, role: "member", joinedAt: now },
        { userId: user3._id, role: "member", joinedAt: now },
        { userId: user4._id, role: "member", joinedAt: now },
      ],
    },
    {
      name: "Office Expenses",
      description: "Shared expenses for our office",
      createdBy: user2._id,
      members: [
        { userId: user2._id, role: "admin", joinedAt: now },
        { userId: user3._id, role: "member", joinedAt: now },
      ],
    },
    {
      name: "Project Alpha",
      description: "Expenses for our project",
      createdBy: user3._id,
      members: [
        { userId: user3._id, role: "admin", joinedAt: now },
        { userId: user1._id, role: "member", joinedAt: now },
        { userId: user2._id, role: "member", joinedAt: now },
        { userId: user4._id, role: "member", joinedAt: now },
      ],
    },
    {
      name: "Book Club",
      description: "For our monthly book purchases",
      createdBy: user4._id,
      members: [
        { userId: user4._id, role: "admin", joinedAt: now },
        { userId: user1._id, role: "member", joinedAt: now },
      ],
    },
  ];

  const groupIds = [];
  for (const groupData of groupDatas) {
    const groupId = await ctx.db.insert("groups", groupData);
    groupIds.push(groupId);
  }

  // Fetch all groups with their IDs
  return await Promise.all(
    groupIds.map(async (id) => {
      const group = await ctx.db.get(id);
      return { ...group, _id: id };
    })
  );
}

// Helper to create one-on-one expenses
async function createOneOnOneExpenses(ctx, users) {
  const user1 = users[0];
  const user2 = users[1];
  const user3 = users[2];
  const user4 = users[3];

  const expenseDatas = [
    {
      description: "Dinner at Indian Restaurant",
      amount: 1250.0,
      category: "foodDrink",
      date: getRandomDate(4),
      paidByUserId: user1._id,
      splitType: "equal",
      splits: [
        { userId: user1._id, amount: 625.0, paid: true },
        { userId: user2._id, amount: 625.0, paid: false },
      ],
      createdBy: user1._id,
    },
    {
      description: "Cab ride to airport",
      amount: 450.0,
      category: "transportation",
      date: getRandomDate(3),
      paidByUserId: user2._id,
      splitType: "equal",
      splits: [
        { userId: user1._id, amount: 225.0, paid: false },
        { userId: user2._id, amount: 225.0, paid: true },
      ],
      createdBy: user2._id,
    },
    {
      description: "Movie tickets",
      amount: 500.0,
      category: "entertainment",
      date: getRandomDate(3),
      paidByUserId: user3._id,
      splitType: "equal",
      splits: [
        { userId: user2._id, amount: 250.0, paid: false },
        { userId: user3._id, amount: 250.0, paid: true },
      ],
      createdBy: user3._id,
    },
    {
      description: "Groceries",
      amount: 1875.5,
      category: "groceries",
      date: getRandomDate(2),
      paidByUserId: user1._id,
      splitType: "percentage",
      splits: [
        { userId: user1._id, amount: 1312.85, paid: true }, // 70%
        { userId: user3._id, amount: 562.65, paid: false }, // 30%
      ],
      createdBy: user1._id,
    },
    {
      description: "Internet bill",
      amount: 1200.0,
      category: "utilities",
      date: getRandomDate(1),
      paidByUserId: user2._id,
      splitType: "equal",
      splits: [
        { userId: user2._id, amount: 600.0, paid: true },
        { userId: user3._id, amount: 600.0, paid: false },
      ],
      createdBy: user2._id,
    },
    {
      description: "Coffee meeting",
      amount: 350.0,
      category: "coffee",
      date: getRandomDate(0),
      paidByUserId: user4._id,
      splitType: "equal",
      splits: [
        { userId: user4._id, amount: 175.0, paid: true },
        { userId: user1._id, amount: 175.0, paid: false },
      ],
      createdBy: user4._id,
    },
  ];

  const expenseIds = [];
  for (const expenseData of expenseDatas) {
    const expenseId = await ctx.db.insert("expenses", expenseData);
    expenseIds.push(expenseId);
  }

  // Fetch all expenses with their IDs
  return await Promise.all(
    expenseIds.map(async (id) => {
      const expense = await ctx.db.get(id);
      return { ...expense, _id: id };
    })
  );
}

// Helper to create group expenses
async function createGroupExpenses(ctx, users, groups) {
  // Using the users from your database
  const user1 = users[0];
  const user2 = users[1];
  const user3 = users[2];
  const user4 = users[3];

  // Weekend Trip Group Expenses
  const weekendTripExpenses = [
    {
      description: "Hotel reservation",
      amount: 9500.0,
      category: "housing",
      date: getRandomDate(4),
      paidByUserId: user1._id,
      splitType: "equal",
      splits: [
        { userId: user1._id, amount: 2375, paid: true },
        { userId: user2._id, amount: 2375, paid: false },
        { userId: user3._id, amount: 2375, paid: false },
        { userId: user4._id, amount: 2375, paid: false },
      ],
      groupId: groups[0]._id, // Weekend Trip Group
      createdBy: user1._id,
    },
    {
      description: "Groceries for weekend",
      amount: 2450.75,
      category: "groceries",
      date: getRandomDate(4),
      paidByUserId: user2._id,
      splitType: "equal",
      splits: [
        { userId: user1._id, amount: 612.69, paid: false },
        { userId: user2._id, amount: 612.69, paid: true },
        { userId: user3._id, amount: 612.69, paid: false },
        { userId: user4._id, amount: 612.68, paid: false },
      ],
      groupId: groups[0]._id, // Weekend Trip Group
      createdBy: user2._id,
    },
  ];

  // Office Expenses
  const officeExpenses = [
    {
      description: "Coffee and snacks",
      amount: 850.0,
      category: "coffee",
      date: getRandomDate(3),
      paidByUserId: user2._id,
      splitType: "equal",
      splits: [
        { userId: user2._id, amount: 425, paid: true },
        { userId: user3._id, amount: 425, paid: false },
      ],
      groupId: groups[1]._id, // Office Expenses Group
      createdBy: user2._id,
    },
  ];

  // Project Alpha Expenses
  const projectExpenses = [
    {
      description: "Domain purchase",
      amount: 1200.0,
      category: "technology",
      date: getRandomDate(1),
      paidByUserId: user3._id,
      splitType: "equal",
      splits: [
        { userId: user1._id, amount: 300, paid: false },
        { userId: user2._id, amount: 300, paid: false },
        { userId: user3._id, amount: 300, paid: true },
        { userId: user4._id, amount: 300, paid: false },
      ],
      groupId: groups[2]._id, // Project Alpha Group
      createdBy: user3._id,
    },
  ];

  // Book Club Expenses
  const bookClubExpenses = [
    {
      description: "Monthly book order",
      amount: 1500.0,
      category: "books",
      date: getRandomDate(2),
      paidByUserId: user4._id,
      splitType: "equal",
      splits: [
        { userId: user1._id, amount: 750, paid: false },
        { userId: user4._id, amount: 750, paid: true },
      ],
      groupId: groups[3]._id, // Book Club Group
      createdBy: user4._id,
    },
  ];

  // Combine all group expenses
  const allGroupExpenses = [
    ...weekendTripExpenses,
    ...officeExpenses,
    ...projectExpenses,
    ...bookClubExpenses,
  ];

  const expenseIds = [];
  for (const expenseData of allGroupExpenses) {
    const expenseId = await ctx.db.insert("expenses", expenseData);
    expenseIds.push(expenseId);
  }

  // Fetch all group expenses with their IDs
  return await Promise.all(
    expenseIds.map(async (id) => {
      const expense = await ctx.db.get(id);
      return { ...expense, _id: id };
    })
  );
}

// Helper to create settlements
async function createSettlements(
  ctx,
  users,
  groups,
  oneOnOneExpenses,
  groupExpenses
) {
  // Using the users from your database
  const user1 = users[0];
  const user2 = users[1];
  const user3 = users[2];
  const user4 = users[3];

  // Find a one-on-one expense to settle
  const cabExpense = oneOnOneExpenses.find(
    (expense) => expense.description === "Cab ride to airport"
  );

  // Find some group expenses to settle
  const hotelExpense = groupExpenses.find(
    (expense) => expense.description === "Hotel reservation"
  );

  const coffeeExpense = groupExpenses.find(
    (expense) => expense.description === "Coffee and snacks"
  );

  const settlementDatas = [
    // Settlement for cab ride
    {
      amount: 225.0, // Amount user1 owes to user2
      note: "For cab ride",
      date: getRandomDate(3),
      paidByUserId: user1._id, // User1 pays
      receivedByUserId: user2._id, // User2 receives
      relatedExpenseIds: cabExpense ? [cabExpense._id] : undefined,
      createdBy: user1._id,
    },
    // Settlement for hotel
    {
      amount: 2375, // Amount user2 owes to user1
      note: "Hotel payment",
      date: getRandomDate(2),
      paidByUserId: user2._id, // User2 pays
      receivedByUserId: user1._id, // User1 receives
      groupId: groups[0]._id, // Weekend Trip Group
      relatedExpenseIds: hotelExpense ? [hotelExpense._id] : undefined,
      createdBy: user2._id,
    },
    // Settlement for office coffee
    {
      amount: 425, // Amount user3 owes to user2
      note: "Office coffee",
      date: getRandomDate(1),
      paidByUserId: user3._id, // User3 pays
      receivedByUserId: user2._id, // User2 receives
      groupId: groups[1]._id, // Office Expenses Group
      relatedExpenseIds: coffeeExpense ? [coffeeExpense._id] : undefined,
      createdBy: user3._id,
    },
    // New settlement
    {
      amount: 750, // Amount user1 owes to user4 for book club
      note: "Book club",
      date: getRandomDate(0),
      paidByUserId: user1._id,
      receivedByUserId: user4._id,
      groupId: groups[3]._id,
      createdBy: user1._id,
    },
  ];

  const settlementIds = [];
  for (const settlementData of settlementDatas) {
    const settlementId = await ctx.db.insert("settlements", settlementData);
    settlementIds.push(settlementId);
  }

  // Fetch all settlements with their IDs
  return await Promise.all(
    settlementIds.map(async (id) => {
      const settlement = await ctx.db.get(id);
      return { ...settlement, _id: id };
    })
  );
}