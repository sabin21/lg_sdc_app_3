module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend:{
      fontFamily: {
        'myeongjo': ["Nanum Myeongjo"],
        'times':["times"]
      },
      letterSpacing: {
        tightest:'-.075em'
      },
      colors: {
        'primary':{
          50:'#EEF9F8',
          100:'#CDF3F1',
          200:'#9CE8E3',
          300:'#11DACE',
          400:'#00BCB1',
          500:'#009E95',
          600:'#007D76',
          700:'#005A55',
          800:'#00403C',
          900:'#002624'
        }
      },
      lineHeight:{
        em09: '0.9em',
        em10: '1.0em',
        em11: '1.1em',
        em12: '1.2em',
        em13: '1.3em',
        em14: '1.4em',
        em15: '1.5em',
        em16: '1.6em',
        em17: '1.7em',
        em18: '1.8em',
        em20: '2.0em'
      }
    },

  },
  plugins: [
  ]
}
