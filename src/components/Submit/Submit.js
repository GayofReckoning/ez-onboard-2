import React, { Component } from "react";
import { connect } from "react-redux";
import {
  Grid,
  Paper,
  Button,
  withStyles,
  Accordion,
  TableHead,
  TableRow,
} from "@material-ui/core";
import {
  AccordionSummary,
  AccordionDetails,
  Table,
  TableCell,
  TableBody,
  Switch,
  AccordionActions,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@material-ui/core";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import DynamicButton from "../Buttons/DynamicButton";


const styles = (theme) => ({
  root: {
    flexGrow: 1,
    alignItems: "center",
    justify: "center",
    color: theme.palette.text.secondary,
    fontFamily: "inter, Open Sans, sans-serif",
    minHeight: "80vh",
    background: "white",
    textAlign: "center",
  },
  paper: {
    padding: theme.spacing(2),
    borderRadius: "5px",
  },
  left: {
    width: "75px",
  },
  grow: {
    flexGrow: 1,
    minWidth: "100px",
  },
  reviewItem: {
    display: "inline-block",
    padding: "0px",
    margin: "0px",
  },
  table: {
    maxWidth: "1000px",
  },
  reviewTable: {
    overflowX: "auto",
    whiteSpace: "nowrap",
  },
  ReviewTable__head: {
    backgroundColor: "#C0C0C0",
  },
  ReviewTable__head__cell: {
    border: "1px solid black",
    padding: "8px",
  },
  MainSubTitle: {
    marginBottom: "2rem",
    fontSize: "20px",
  },
  SubTitle: {
    marginBottom: "1rem",
    fontSize: "15px",
  },
  DeviceSubTitle: {
    fontSize: "15px",
    marginBottom: "1rem",
  },
});

class Submit extends Component {
  state = {
    tableMode: true,
    open: false,
    deletedName: "",
    deletedID: "",
  };

  handleChange = (name) => (event) => {
    this.setState({ [name]: event.target.checked });
    //console.log(this.state);
  };

  handleEditFor = (data) => {
    //console.log('in handleEditFor', index)
    //console.log('selected device:', this.props.state.allDevice[index.index]);
    //supply newdevice reducer with info for this device
    const device = this.props.state.allDevice[data.index];
    this.props.dispatch({ type: "SET_NAME", payload: device.name });
    this.props.dispatch({ type: "SET_ID", payload: device.id });
    const date = device.install_date.substring(0, 10);
    this.props.dispatch({ type: "SET_DATE", payload: date });
    const site = {
      id: device.site_id,
      address: device.address,
      first_name: device.first_name,
      second_name: device.second_name,
      phone: device.phone,
      email: device.email,
      organization_id: this.props.state.organization.id,
    };
    console.log("device site:", site);
    this.props.dispatch({ type: "SET_DEVICE_SITE", payload: site });
    this.props.dispatch({ type: "FETCH_SITE_BREAKERS", payload: site.id });
    const breaker = {
      description: device.description,
      id: device.breaker_id,
      limit: device.limit,
      name: device.breaker_name,
      site_id: device.site_id,
    };
    console.log("device breaker:", breaker);
    this.props.dispatch({ type: "SET_BREAKER", payload: breaker });
    this.props.dispatch({
      type: "SET_SERIAL",
      payload: { number: device.serial_number },
    });
    const type = {
      name: device.type_name,
      id: device.type_id,
    };
    this.props.dispatch({ type: "SET_TYPE", payload: type });
  }; //end handleReviewFor

  handleSubmit = () => {
    const sendObject = {
      primary_user: this.props.state.user,
      organization: this.props.state.organization,
      host_sites: this.props.state.site,
      devices: this.props.state.allDevice,
    };
    const onboardPackage = {
      name: "Zef EZ Onboard",
      //change to the email that we want to send emails to
      email: "support@zefenergy.com",
      message: JSON.stringify(sendObject),
    };
    this.props.dispatch({
      type: "SUBMIT_ORGANIZATION",
      payload: this.props.state.organization.id,
    });
    this.props.dispatch({ type: "MAIL_PACKAGE", payload: onboardPackage });
  };

  handleDelete = () => {
    const deleteObject = {
      id: this.state.deletedID,
      org_id: this.props.state.organization.id,
    };
    this.props.dispatch({ type: "DELETE_DEVICE", payload: deleteObject });
    this.handleClose();
  };

  handleClickOpen = (name, id) => {
    this.setState({
      ...this.state,
      open: true,
      deletedName: name,
      deletedID: id,
    });
  };

  handleClose = () => {
    this.setState({ ...this.state, open: false });
  };

  render() {
    const { classes } = this.props;
    return (
      <Grid
        container
        direction="row"
        justify="center"
        alignContent="center"
        alignItems="center"
      >
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="confirm-delete"
          aria-describedby="confirm-device-delete"
        >
          <DialogContent>
            <DialogContentText id="confirm-device-delete">
              Are you sure you want to delete this device -{" "}
              {this.state.deletedName}?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Oops, no.
            </Button>
            <Button onClick={this.handleDelete} color="primary" autoFocus>
              Yes, delete!
            </Button>
          </DialogActions>
        </Dialog>
        <div className={classes.root} style={{ minWidth: "1000px", maxWidth: '1000px' }}>
          <Paper className={classes.paper}>
            <Grid item align="center" style={{ marginBottom: "2rem" }}>
              <h1>All Devices and ZefNet Users Added?</h1>
              <p className={classes.MainSubTitle}>
                Let's review all your data before you submit.
              </p>
              <h2>Here are your chosen users and corresponding information</h2>
              <p className={classes.SubTitle}>
                Please double-check all information and each user's privileges
              </p>
              <Table className={classes.table}>
                <TableHead className={classes.ReviewTable__head}>
                  <TableRow>
                    <TableCell className={classes.ReviewTable__head__cell}>
                      First Name
                    </TableCell>
                    <TableCell
                      align="right"
                      className={classes.ReviewTable__head__cell}
                    >
                      Last Name
                    </TableCell>
                    <TableCell
                      align="right"
                      className={classes.ReviewTable__head__cell}
                    >
                      Email Address
                    </TableCell>
                    <TableCell
                      align="right"
                      className={classes.ReviewTable__head__cell}
                    >
                      Phone Number
                    </TableCell>
                    <TableCell
                      align="right"
                      className={classes.ReviewTable__head__cell}
                    >
                      Privileges
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody style={{ border: "1px solid #C0C0C0" }}>
                  {this.props.state.zefUser.map((user, index) => (
                    <TableRow key={index}>
                      <TableCell component="th" scope="row">
                        {user.first_name}
                      </TableCell>
                      <TableCell align="right">{user.last_name}</TableCell>
                      <TableCell align="right">{user.email}</TableCell>
                      <TableCell align="right">{user.phone}</TableCell>
                      <TableCell align="right">
                        {user.editor ? "Edit" : "View"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <DynamicButton type="edit" text="Edit Users" linkURL="/addUser" />
            </Grid>
            <Grid item align="center" xs={12}>
              <h2>
                Here are your devices, with breaker and location information
              </h2>
              <p className={classes.DeviceSubTitle}>
                Use switch to view device table or expandable pages
              </p>
              <Grid
                component="label"
                container
                alignItems="center"
                spacing={1}
                direction="row"
                justify="center"
                style={{ border: "1px solid black", maxWidth: "320px" }}
              >
                <Grid item>Expandable Form View</Grid>
                <Grid item>
                  <Switch
                    checked={this.state.tableMode}
                    onChange={this.handleChange("tableMode")}
                    value="tableMode"
                    color="primary"
                  />
                </Grid>
                <Grid item>Table View</Grid>
              </Grid>
            </Grid>
            {/* Map out each device as an accordion, or a table */}
            {this.state.tableMode ? (
              <div className={classes.reviewTable}>
                <Table>
                  <TableHead className={classes.ReviewTable__head}>
                    <TableRow>
                      <TableCell
                        align="center"
                        className={classes.ReviewTable__head__cell}
                      ></TableCell>
                      <TableCell
                        align="center"
                        className={classes.ReviewTable__head__cell}
                      >
                        Device Name
                      </TableCell>
                      <TableCell
                        align="center"
                        className={classes.ReviewTable__head__cell}
                      >
                        Device Type
                      </TableCell>
                      <TableCell
                        align="center"
                        className={classes.ReviewTable__head__cell}
                      >
                        Serial Number
                      </TableCell>
                      <TableCell
                        align="center"
                        className={classes.ReviewTable__head__cell}
                      >
                        Second Serial
                      </TableCell>
                      <TableCell
                        align="center"
                        className={classes.ReviewTable__head__cell}
                      >
                        Installation Date
                      </TableCell>
                      <TableCell
                        align="center"
                        className={classes.ReviewTable__head__cell}
                      >
                        Hosting Site Address
                      </TableCell>
                      <TableCell
                        align="center"
                        className={classes.ReviewTable__head__cell}
                      >
                        Contact First Name
                      </TableCell>
                      <TableCell
                        align="center"
                        className={classes.ReviewTable__head__cell}
                      >
                        Contact Last Name
                      </TableCell>
                      <TableCell
                        align="center"
                        className={classes.ReviewTable__head__cell}
                      >
                        Contact Phone
                      </TableCell>
                      <TableCell
                        align="center"
                        className={classes.ReviewTable__head__cell}
                      >
                        Contact Email
                      </TableCell>
                      <TableCell
                        align="center"
                        className={classes.ReviewTable__head__cell}
                      >
                        Breaker Name
                      </TableCell>
                      <TableCell
                        align="center"
                        className={classes.ReviewTable__head__cell}
                      >
                        Breaker Limit
                      </TableCell>
                      <TableCell
                        align="center"
                        className={classes.ReviewTable__head__cell}
                      >
                        Breaker Description
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody style={{ border: "1px solid #e0e0e0" }}>
                    {this.props.state.allDevice.map((device, index) => (
                      <TableRow key={index}>
                        <TableCell component="th" scope="row">
                          <Button
                            variant="outlined"
                            onClick={() => {
                              this.handleEditFor({ index });
                            }}
                            component={Link}
                            to="/deviceReview"
                          >
                            Edit <EditIcon />
                          </Button>
                          <Button
                            variant="outlined"
                            onClick={() => {
                              this.handleClickOpen(device.name, device.id);
                            }}
                          >
                            Delete
                            <DeleteIcon />
                          </Button>
                        </TableCell>
                        <TableCell align="right">{device.name}</TableCell>
                        <TableCell align="right">{device.type_name}</TableCell>
                        <TableCell align="right">
                          {device.serial_number}
                        </TableCell>
                        <TableCell align="right">
                          {device.serial_number2}
                        </TableCell>
                        <TableCell align="right">
                          {" "}
                          {device.install_date.substring(0, 10)}
                        </TableCell>
                        <TableCell align="right">{device.address}</TableCell>
                        <TableCell align="right">{device.first_name}</TableCell>
                        <TableCell align="right">
                          {device.second_name}
                        </TableCell>
                        <TableCell align="right">{device.phone}</TableCell>
                        <TableCell align="right">{device.email}</TableCell>
                        <TableCell align="right">
                          {device.breaker_name}
                        </TableCell>
                        <TableCell align="right">
                          {device.limit}
                          {"\u00A0"} Amps
                        </TableCell>
                        <TableCell align="right">
                          {device.description}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <Grid item xs={12}>
                {this.props.state.allDevice.map((device, index) => (
                  <Accordion key={index} hover>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      style={{ backgroundColor: "#C0C0C0", margin: "0" }}
                    >
                      <h2>{device.name}</h2>

                    </AccordionSummary>
                    <AccordionActions>
                      <Button
                        variant="outlined"
                        onClick={() => {
                          this.handleClickOpen(device.name, device.id);
                        }}
                      >
                        Delete Device
                        <DeleteIcon />
                      </Button>
                    </AccordionActions>
                    <AccordionDetails>
                      <Grid
                        container
                        direction="row"
                        justify="center"
                        alignContent="center"
                        alignItems="center"
                      >
                        <Grid item align="center" xs={12}>
                          <Grid
                            container
                            direction="row"
                            alignItems="center"
                            justify="space-between"
                          >
                            <div className={classes.left} />
                            <h2>Hosting Location</h2>
                            <Button
                              onClick={() => {
                                this.handleEditFor({ index });
                              }}
                              component={Link}
                              to="/hostSelect"
                            >
                              Edit <EditIcon />
                            </Button>
                          </Grid>
                        </Grid>
                        <Grid
                          item
                          align="center"
                          xs={12}
                          style={{ backgroundColor: "lightgrey" }}
                        >
                          <h3 style={{ display: "inline-block" }}>
                            Address:{"\u00A0"}
                            {"\u00A0"}
                          </h3>
                          <p style={{ display: "inline-block" }}>
                            {device.address}
                          </p>
                        </Grid>
                        <Grid item align="center" xs={12}>
                          <h2>Local Contact for Location</h2>
                        </Grid>
                        <Grid
                          item
                          align="center"
                          xs={12}
                          style={{ backgroundColor: "lightgrey" }}
                        >
                          <div>
                            <h3
                              className={classes.reviewItem}
                              style={{ marginTop: "10px" }}
                            >
                              First Name:{"\u00A0"}
                              {"\u00A0"}
                            </h3>
                            <p className={classes.reviewItem}>
                              {device.first_name}
                            </p>
                          </div>
                          <div>
                            <h3 className={classes.reviewItem}>
                              Second Name:{"\u00A0"}
                              {"\u00A0"}
                            </h3>
                            <p className={classes.reviewItem}>
                              {device.second_name}
                            </p>
                          </div>
                          <div>
                            <h3 className={classes.reviewItem}>
                              Phone Number:{"\u00A0"}
                              {"\u00A0"}
                            </h3>
                            <p className={classes.reviewItem}>{device.phone}</p>
                          </div>
                          <div>
                            <h3
                              className={classes.reviewItem}
                              style={{ marginBottom: "10px" }}
                            >
                              Email:{"\u00A0"}
                              {"\u00A0"}
                            </h3>
                            <p className={classes.reviewItem}>{device.email}</p>
                          </div>
                        </Grid>

                        <Grid item align="center" xs={12}>
                          <Grid
                            container
                            direction="row"
                            alignItems="center"
                            justify="space-between"
                          >
                            <div className={classes.left} />
                            <h2>Breaker Information</h2>
                            <Button
                              onClick={() => {
                                this.handleEditFor({ index });
                              }}
                              component={Link}
                              to="/breakerSelect"
                            >
                              Edit <EditIcon />
                            </Button>
                          </Grid>
                        </Grid>

                        <Grid
                          item
                          align="center"
                          xs={12}
                          style={{ backgroundColor: "lightgrey" }}
                        >
                          <div>
                            <h3
                              className={classes.reviewItem}
                              style={{ marginTop: "10px" }}
                            >
                              Breaker Name:{"\u00A0"}
                              {"\u00A0"}
                            </h3>
                            <p className={classes.reviewItem}>
                              {device.breaker_name}
                            </p>
                          </div>
                          <div>
                            <h3 className={classes.reviewItem}>
                              Breaker Limit:{"\u00A0"}
                              {"\u00A0"}
                            </h3>
                            <p className={classes.reviewItem}>
                              {device.limit}
                              {"\u00A0"}Amps
                            </p>
                          </div>
                          <div>
                            <h3
                              className={classes.reviewItem}
                              style={{ marginBottom: "10px" }}
                            >
                              Breaker Description:{"\u00A0"}
                              {"\u00A0"}
                            </h3>
                            <p className={classes.reviewItem}>
                              {device.description}
                            </p>
                          </div>
                        </Grid>

                        <Grid item align="center" xs={12}>
                          <Grid
                            container
                            direction="row"
                            alignItems="center"
                            justify="space-between"
                          >
                            <div className={classes.left} />
                            <h2>Device Type</h2>
                            <Button
                              onClick={() => {
                                this.handleEditFor({ index });
                              }}
                              component={Link}
                              to="/deviceType"
                            >
                              Edit <EditIcon />
                            </Button>
                          </Grid>
                        </Grid>

                        <Grid
                          item
                          align="center"
                          xs={12}
                          style={{ backgroundColor: "lightgrey" }}
                        >
                          <div>
                            <h3
                              className={classes.reviewItem}
                              style={{ marginTop: "10px" }}
                            >
                              Device Type:{"\u00A0"}
                              {"\u00A0"}
                            </h3>
                            <p className={classes.reviewItem}>
                              {device.type_name}
                            </p>
                          </div>
                        </Grid>

                        <Grid item align="center" xs={12}>
                          <Grid
                            container
                            direction="row"
                            alignItems="center"
                            justify="space-between"
                          >
                            <div className={classes.left} />
                            <h2>Device Information</h2>
                            <Button
                              onClick={() => {
                                this.handleEditFor({ index });
                              }}
                              component={Link}
                              to="/deviceSerial"
                            >
                              Edit <EditIcon />
                            </Button>
                          </Grid>
                        </Grid>

                        <Grid
                          item
                          align="center"
                          xs={12}
                          style={{ backgroundColor: "lightgrey" }}
                        >
                          <div>
                            <h3
                              className={classes.reviewItem}
                              style={{ margin: "10px 0px" }}
                            >
                              Serial Number:{"\u00A0"}
                              {"\u00A0"}
                            </h3>
                            <p className={classes.reviewItem}>
                              {device.serial_number}
                            </p>
                          </div>
                          {device.serial_number2 && (
                            <div>
                              <h3
                                className={classes.reviewItem}
                                style={{ margin: "10px 0px" }}
                              >
                                Second Serial Number:{"\u00A0"}
                                {"\u00A0"}
                              </h3>
                              <p className={classes.reviewItem}>
                                {device.serial_number2}
                              </p>
                            </div>
                          )}
                        </Grid>
                        <Grid item align="center" xs={12}>
                          <Grid
                            container
                            direction="row"
                            alignItems="center"
                            justify="space-between"
                          >
                            <div className={classes.left} />
                            <h2>Additional Information</h2>
                            <Button
                              onClick={() => {
                                this.handleEditFor({ index });
                              }}
                              component={Link}
                              to="/deviceName"
                            >
                              Edit <EditIcon />
                            </Button>
                          </Grid>
                        </Grid>

                        <Grid
                          item
                          align="center"
                          xs={12}
                          style={{ backgroundColor: "lightgrey" }}
                        >
                          <div>
                            <h3
                              className={classes.reviewItem}
                              style={{ marginTop: "10px" }}
                            >
                              Charger Name:{"\u00A0"}
                              {"\u00A0"}
                            </h3>
                            <p className={classes.reviewItem}>{device.name}</p>
                          </div>
                          <div>
                            <h3
                              className={classes.reviewItem}
                              style={{ marginBottom: "10px" }}
                            >
                              Installation Date:{"\u00A0"}
                              {"\u00A0"}
                            </h3>
                            <p className={classes.reviewItem}>
                              {device.install_date.substring(0, 10)}
                            </p>
                          </div>
                        </Grid>
                      </Grid>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </Grid>
            )}
            <Grid
              container
              direction="row"
              justify="center"
              alignContent="center"
              style={{ marginTop: "35px" }}
            >
              <DynamicButton
                type="home"
                text="Home"
                linkURL="/organizationHome"
              />
              <div className={classes.grow}>{"\u00A0"}</div>
              {this.props.state.allDevice.length > 0 ? (
                <DynamicButton
                  key="enabled-submit-button"
                  type="submit"
                  text="Submit Onboarding Package for Review"
                  linkURL="/completed"
                  handleClick={this.handleSubmit}
                />
              ) : (
                <DynamicButton
                  key="disabled-submit-button"
                  type="submit"
                  text="Please Add A Device Before Submitting"
                  isDisabled={true}
                />
              )}
            </Grid>
          </Paper>
        </div>
      </Grid>
    );

  }
}

Submit.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  state,
});

export default withStyles(styles)(connect(mapStateToProps)(Submit));
