module.exports = {
  lineControl: {
    margin: 20,
  },
  formControl: {
    display: 'block',
    margin: 20,
    '& .MuiInput-formControl': {
      width: 200,
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        width: 200,
      },
    },
  },
  formControlTB: {
    display: 'block',
    marginTop: 20,
    marginBottom: 20,
    // margin: 20
  },
  formBlock: {
    display: 'block',
    margin: 20,
    minWidth: 120,
  },
  formLine: {
    margin: 15,
  },
  root1: {
    display: 'flex',
    flexWrap: 'wrap',
    '& > *': {
      margin: 8,
      padding: 16,
      width: '100%',
    },
    lineControl: {
      paddingTop: '20px',
    },
  },
  rootflexGrow: {
    flexGrow: 1,
  },
  paperCenter: {
    padding: 8,
    textAlign: 'center',
  },
  defaultBlock: {
    table: {
      minWidth: 650,
    },
    root: {
      display: 'block',
    },
    heading: {
      fontSize: '18px',
    },
  },
};
