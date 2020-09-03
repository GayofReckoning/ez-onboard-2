import React, { Component } from 'react';
import {connect} from 'react-redux';
import{Grid, Button, Select, Paper, Divider, InputLabel, FormControl, MenuItem} from '@material-ui/core';
import PropTypes from 'prop-types';
import { withStyles, } from '@material-ui/core/styles';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { Link } from 'react-router-dom';
import AddSite from './Add';


const styles = theme => ({ 
  root: {
    flexGrow: 1,
    alignItems: 'center',
    justify: 'center',
    color: theme.palette.text.secondary,
    fontFamily: 'Crimson Text, Open Sans, sans-serif',
    minHeight: '100vh', 
    minWidth: '100vw', 
    background: 'white',
    textAlign: 'center',
  },
  paper:{
    padding: theme.spacing(2),
    borderRadius: '5px',
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 320,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  grow:{
      flexGrow: 1
  }
})


class HostSelect extends Component {
  state = {
    selectedSite: '',
    open: false
  };

  componentDidMount = ()=> {
        this.setState({
            open: false,
            selectedSite: ''
        })
  }

  addSite = () => {
      this.setState ({
          ...this.state,
          open: true,
      })
  }

  handleClose = () => {
    this.setState ({
        ...this.state,
        open: false,
    })
}

  handleChange =  (event) => {
    this.setState({
      selectedSite: event.target.value,
    });
  }

  componentDidUpdate(previousProps){
      if(previousProps.state.site && (previousProps.state.site !== this.props.state.site)){
         // set state to selectedsite: this.props.newDevice.site
         this.setState({
             selectedSite:this.props.state.site[this.props.state.site.length-1]
         })
      }
  }

  assignSite = () => {
    this.props.dispatch({type: 'SET_DEVICE_SITE', payload: this.state.selectedSite})
  }

  render() {
    const {classes} = this.props;
    return (
      <div className = {classes.root} >
         <AddSite handleClose = {this.handleClose} open = {this.state.open}/>
        <Grid container direction = 'column' justify = 'center' alignItems = 'center'>
          <Grid item xs = {12} md = {10} lg = {9} xl = {8}>
            <Paper className = {classes.paper} elevation = {3}>
                <h1>Select Your Host Site</h1>
                <div>
                <p>Please choose from below or input a new Host Site where your new charger will be located. 
                    This does not have to be the same as your organization's primary address.
                    If you have multiple Host Sites, you can complete this process multiple times for each device.</p>   
                </div>
                <FormControl variant="outlined" className={classes.formControl}>
                    <InputLabel>Choose From Existing</InputLabel>
                    <Select
                    id = 'siteSelect'
                    value={this.state.selectedSite}
                    onChange={this.handleChange}
                    >
                    <MenuItem value="">
                        <em>None of these</em>
                    </MenuItem>
                    {this.props.state.site.map((site, index)=>
                    (<MenuItem value={site} key = {index}>{site.address}</MenuItem>)
                    )}
                    </Select>
                </FormControl>
                <br/>
                <br/>
                <Divider/>
                <h1>Or</h1>
                {this.state.selectedSite ? 
                    <Button variant = 'contained' disabled>
                        Add New Host Site
                    </Button>
                :
                <Button variant = 'contained' color = 'primary' onClick = {this.addSite}>
                    Add New Host Site
                </Button>
                }     
                <br/>
                <br/>
                <Grid container direction = 'row'>
                    <Button variant ='contained'
                    component = {Link} to ="/test">
                        <ChevronLeftIcon/> Previous
                    </Button>
                    <div className = {classes.grow}></div>
                    {this.state.selectedSite ?
                        <Button variant = 'contained' color = 'primary'
                        onClick = {this.assignSite}
                        component = {Link} to ="/breakerSelect">
                            <ChevronRightIcon/> Next
                        </Button>
                    :
                        <Button variant = 'contained' disabled>
                            <ChevronRightIcon/> Next
                        </Button>
                    }
                </Grid>
            </Paper>
            </Grid>
        </Grid>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  state,
});

HostSelect.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(connect(mapStateToProps)(HostSelect));


