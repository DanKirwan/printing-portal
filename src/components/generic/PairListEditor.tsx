import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, Stack, Typography } from '@mui/material';
import { FC, Fragment, useState } from 'react';
import { NumberField } from './NumberField';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

interface Props {
    keyTitle: string;
    valueTitle: string;
    entries: { key: number, value: number }[];
    setEntries: (values: { key: number, value: number }[]) => void;
}

export const PairListEditor: FC<Props> = ({ entries, setEntries, keyTitle, valueTitle }) => {

    const [addDialogOpen, setAddDialogOpen] = useState(false);

    const [newKey, setNewKey] = useState<number | null>(null);
    const [newValue, setNewValue] = useState<number | null>(null);

    const updateKey = (index: number, newKey: number) => {
        setEntries(entries.map(({ key, value }, i) => i == index ? { key: newKey, value } : { key, value }));
    }

    const updateValue = (index: number, newValue: number) => {
        setEntries(entries.map(({ key, value }, i) => i == index ? { key, value: newValue } : { key, value }));
    }

    const deleteRow = (index: number) => {
        setEntries(entries.filter((row, i) => i != index))
    }
    const addRow = () => {
        if (newKey == null || newValue == null) return;
        setEntries([...entries, { key: newKey, value: newValue }]);
        setNewKey(null);
        setNewValue(null);
        setAddDialogOpen(false);
    }

    return (
        <Grid container>
            <Grid xs={5} item>
                <Typography>{keyTitle}</Typography>
            </Grid>
            <Grid xs={5} item>
                <Typography>{valueTitle}</Typography>
            </Grid>
            {entries.map(({ key, value }, i) => (
                <Fragment key={i}>
                    <Grid xs={5} item>
                        <NumberField value={key} setValue={(x) => updateKey(i, x)} />
                    </Grid>
                    <Grid xs={5} item>
                        <NumberField value={value} setValue={(x) => updateValue(i, x)} />
                    </Grid>
                    <Grid xs={2} item>
                        <IconButton onClick={() => deleteRow(i)}>
                            <DeleteIcon />
                        </IconButton>

                    </Grid>
                </Fragment>
            ))}

            <Grid xs={10} item alignItems='center' justifyContent='center'>
                <Stack direction='row' justifyContent='center'>

                    <IconButton onClick={() => setAddDialogOpen(true)}>
                        <AddIcon />
                    </IconButton>
                </Stack>
            </Grid>

            <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)}>
                <DialogTitle>
                    Add Row
                </DialogTitle>

                <DialogContent>
                    <Grid container padding={2}>
                        <Grid xs={6} item>
                            <NumberField setValue={setNewKey} value={newKey ?? 0} label={keyTitle} />
                        </Grid>
                        <Grid xs={6} item>
                            <NumberField setValue={setNewValue} value={newValue ?? 0} label={valueTitle} />
                        </Grid>

                    </Grid>
                </DialogContent>

                <DialogActions>
                    <Button onClick={() => setAddDialogOpen(false)} variant='contained'>Close</Button>
                    <Button onClick={() => addRow()} variant='contained' color='secondary'>Add Value</Button>
                </DialogActions>
            </Dialog>
        </Grid >
    )
}
