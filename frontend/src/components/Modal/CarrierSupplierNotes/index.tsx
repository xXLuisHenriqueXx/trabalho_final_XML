import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/utils/FormatCurrency";

const CarrierSupplierNotes = ({
  show,
  setShow,
  data,
}: {
  show: boolean;
  setShow: (show: boolean) => void;
  data: any;
}) => {
  return (
    <>
      {show && (
        <div
          className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-black/90 z-10"
          onClick={() => setShow(false)}
        >
          <Card
            className="max-w-6xl w-full max-h-[calc(100vh-4rem)] h-full overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <CardHeader>
              <CardTitle>Notas Fiscais</CardTitle>
            </CardHeader>

            <CardContent className="text-xs">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Número</TableHead>
                    <TableHead>Valor Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data &&
                    data.length > 0 &&
                    data.map((item: any) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.id}</TableCell>
                        <TableCell>{item.number}</TableCell>
                        <TableCell>
                          {formatCurrency(Number(item.value))}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default CarrierSupplierNotes;
