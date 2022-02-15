import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { makeStyles} from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { Select, MenuItem, FormControl, RadioGroup, FormControlLabel, Radio, InputAdornment } from '@material-ui/core';

const axios = require('axios');
const BASE_URL = 'https://damp-eyrie-80368.herokuapp.com';

function getIds() {
  
  const jsonIds = require('./pkgids.json');

  let a = jsonIds[0]["result"];
  let data = [];
  
  a.forEach(function(m) {
    if(m.menu['@attributes']['pkgid']) {
        data.push(m.menu['@attributes'])
    }
  })
  return data;
} 



function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://web.facebook.com/adipati.aarya">
        Arya Studio
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    borderStyle:'groove',
    padding:'12px'
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor:'#ffffff',
    height:'100%',
    width:'20%',
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));




function App() {
  const classes = useStyles();
  const pkgIds = getIds();

  const [otp, setOtp] = React.useState('');
  const [msisdn, setMsisdn] = React.useState('');
  const [pkgid, setPkgid] = React.useState('');
  const [token, setToken] = React.useState('')


  const [loading, setLoading] = React.useState(false);
  const [response, setResponse] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const [auto, setAuto] = React.useState(true);
  const [method, setMethod] = React.useState('buy')
  
  
  //Request OTP
  async function fetchData (url, requestBody, callBack )  {

    const headers = {
      headers: {
        'Content-Type': 'application/json'
      }
    }
    try {
      setLoading(true)
      const { data } = await axios.post(url, requestBody, headers)
      if(data.status_code === 200) {
        setLoading(false);
        setOpen(true);
        callBack(data,true)

      }
      else {
        setLoading(false);
        callBack(data, false)
      }

    } catch (err) {
      alert (`Jaringan Error ${err} Atau terjadi Kesalahan`);
      setResponse('')
      setLoading(false);
    }

  };

  const requestOtp = async (e) => {
         e.preventDefault();
      setResponse(`OTP Request ${msisdn} ...`)
 
    
      if(!msisdn) {
        alert ('Input Tidak lengkap')
        setResponse('')

      } else {
        
        await fetchData(`${BASE_URL}/otp`, {msisdn}, function(res, status) { setResponse(JSON.stringify(res))})
      }
  }
  const loginOtp = async (e)=> {
   
    e.preventDefault();
     
        if(token) {
          await buyPackage(token, pkgid)
          return
        }
        if (!otp || !pkgid) {
          setResponse('Request OTP Dulu')
          return
        }
        setResponse('Login Otp ..')
        await fetchData(`${BASE_URL}/loginotp`, {msisdn, otp_code:otp }, async function(data, status) {
          if(status) {
              await buyPackage(data.token, pkgid)
          }
          else
            { setResponse(JSON.stringify(data)); }
        })
      
    
    
  }
  const buyPackage = async (token, pkgid) => {
    setResponse('Buy Package : ' + pkgid + " token : " + token)

    await fetchData(`${BASE_URL}/package/${method}`,{token, pkgid}, function(res, status) {setResponse(JSON.stringify(res))})
    setToken(token)

  }
  const renderGetOtp = () => {

    let rendered = (
      <TextField
        variant="outlined"
        margin="normal"
        required
        fullWidth
        placeholder="0838xxxxxxxxx"
        onChange={(e)=> setMsisdn(e.target.value)}
        value={msisdn}
        disabled={loading}
        label="No Telp"
        InputProps={{
          endAdornment: (
            <InputAdornment position='end'>
              <Button onClick={(e)=>requestOtp(e)} variant="outlined"  size="small" color="secondary" disabled={loading}>GET OTP</Button>
            </InputAdornment>
              ),
            }}
       
        />
    )
    if (open) {
      rendered = (
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          placeholder="XGHLJ"
          label="OTP KODE"
          onChange={(e)=> setOtp(e.target.value)}
          value={otp}
          name="otp"
         
        />
      )
    }

    return rendered;

  }
  /*
  curl --location --request POST 'https://young-beyond-38984.herokuapp.com/otp' --data-raw '{"msisdn":"083826712349"}'

curl --location --request POST 'https://young-beyond-38984.herokuapp.com/loginotp' --data-raw '{"msisdn":"083826712349", "otp_code":"XHGKL"}'

curl --location --request POST 'https://young-beyond-38984.herokuapp.com/package/buy' --data-raw '{"token":"nsbsds.asa-093434soii", "pkgid":"3212256"}'

curl --location --request POST 'https://young-beyond-38984.herokuapp.com/package/claim' --data-raw '{"token":"nsbsds.asa-093434soii", "pkgid":"3212254"}'

curl --location --request POST 'https://young-beyond-38984.herokuapp.com/package/card' --data-raw '{"token":"nsbsds.asa-093434soii", "pkgid":"32154454"}'
   */

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Axis_logo_2015.svg/82px-Axis_logo_2015.svg.png" alt=""/>

        </Avatar>

        <h1>Axis beta v.1.0</h1>
       
        <form className={classes.form} noValidate onSubmit={async (e)=> loginOtp(e)}>
          {renderGetOtp()}
          
          <Button size='small' variant='outlined' color='primary' onClick={()=>setAuto(!auto)}>{auto ?"Auto":"Manual"}</Button>
        
          <br/>
          {auto ? 
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="pkgid"
            label="Pkgid"
            placeholder="3212255"
            onChange={(e)=> setPkgid(e.target.value)}
            
            value={pkgid}
            disabled={loading}
           
          />:
          <Select labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={pkgid}
            fullWidth
            displayEmpty
            onChange={(e)=> setPkgid(e.target.value)}>
            <MenuItem value="">
            <em>Pilih Paket </em>
            
            </MenuItem>
          {pkgIds.map((pkg, i)=> <MenuItem key={i} value={pkg.pkgid}>{pkg.desc}</MenuItem>)}
            
          </Select>
          }
           <FormControl>
             <RadioGroup
              value={method}
              onChange={(e)=> setMethod(e.target.value)}
        row
        aria-labelledby="demo-row-radio-buttons-group-label"
        name="row-radio-buttons-group"
      >
        <FormControlLabel value="buy" control={<Radio />} label="Buy" />
        <FormControlLabel value="claim" control={<Radio />} label="Claim" />
        <FormControlLabel value="card" control={<Radio />} label="Card" />
        
      </RadioGroup>
    </FormControl>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            disabled={loading}
          >
            BELI PAKET 
          </Button>
        
        </form>
        <p>{response}</p>

       
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
}
export default App;
