import { interval } from 'rxjs';
import React, { useEffect, useState, useCallback } from 'react'
import {  Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { Button, ButtonGroup, Card, CardActions, CardContent, Container, Grid, Typography } from '@material-ui/core';
import useStyles from './styles'

export default function App() {
  const [sec, setSec] = useState(0);
  const [status, setStatus] = useState("stop");
  const [isOn, setIsOn] = useState(false)
  const classes = useStyles()
 
  useEffect(() => {
    const unsubscribe$ = new Subject();
    interval(1000)
      .pipe(takeUntil(unsubscribe$))
      .subscribe(() => {
        if (status === "run") {
          setSec(val => val + 1000);
        }
      });
    return () => {
      unsubscribe$.next();
      unsubscribe$.complete();
    };
  }, [status]);
 
  const start = useCallback(() => {
    setStatus("run");
    setIsOn(true)
  }, []);
 
  const stop = useCallback(() => {
    setStatus("stop");
    setSec(0);
    setIsOn(false)
  }, []);
 
  const reset = useCallback(() => {
    setSec(0);
  }, []);
 
  const wait = useCallback(() => {
    setStatus("wait");
    setIsOn(false)
  }, []);
 
  console.log(new Date(sec));
  return (
    <Container className={classes.cardGrid} maxWidth='lg'>
      <Grid container justify='center'>
        <Grid item xs={12} sm={12} md={8} lg={6}>
          <Card className={classes.card}>
            <CardContent className={classes.cardContent}>
              <Typography variant='h1'>{new Date(sec).toISOString().slice(11, 19)}</Typography>
            </CardContent>
            <CardActions>
              <ButtonGroup align='center' variant='contained' color='primary'>
                {!isOn
                  ?<Button onClick={start}>Start</Button>
                  :<Button onClick={stop}>Stop</Button>}
                <Button onClick={reset}>Reset</Button>
                <Button onClick={wait}>Wait</Button>
              </ButtonGroup>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}