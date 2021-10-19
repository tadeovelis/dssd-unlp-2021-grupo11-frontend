import LinearProgress from '@mui/material/LinearProgress';

export default function LineaProgresoTramite(props) {
    return (
        <LinearProgress
            sx={{
                borderRadius: 5,
                height: 10,
            }}
            color={props.color}
            variant="buffer"
            value={props.value}
            valueBuffer={0}
        />
    )
}