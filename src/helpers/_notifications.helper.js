const notifications = {
  account_v_confirmed: () => ({
    title: 'Account verfication confirmed ✅',
    description: 'Your account has been verfied! continue to enjoy our services 😃',
  }),
  account_v_denied: (more) => ({
    title: 'Account verfication denied 😞',
    description: `Your account could not be verfied due to the following reasons, \n${more}`,
  })
};

export default notifications;
