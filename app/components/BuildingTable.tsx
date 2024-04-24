"use client"
import React, {useEffect, useState} from "react";
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Input,
    Button,
    DropdownTrigger,
    Dropdown,
    DropdownMenu,
    DropdownItem,
    Chip,
    Pagination,
    Selection,
    ChipProps,
    SortDescriptor, Spinner
} from "@nextui-org/react";
import {SearchIcon} from "@/app/components/icons/SearchIcon";
import {ChevronDownIcon} from "@/app/components/icons/ChevronDownIcon";
import {PlusIcon} from "@/app/components/icons/PlusIcon";
import {collection, doc, getDoc, getDocs, onSnapshot, orderBy, query, where} from "@firebase/firestore";
import {db} from "@/app/lib/firebase";

const statusColorMap: Record<string, ChipProps["color"]> = {
    active: "success",
    paused: "danger",
    vacation: "warning",
};

const INITIAL_VISIBLE_COLUMNS = ["အမှတ်စဉ်", "အဆောင်", "အလှူရှင်", "Actions"];
const columns = [
    {name: "အမှတ်စဉ်", uid: "id_en", sortable: true},
    {name: "အဆောင်", uid: "name", sortable: true},
    {name: "အလှူရှင်", uid: "donor", sortable: true},
    {name: "Actions", uid: "Actions"},
];

import Building from "@/app/lib/BuildingModel";
import {VerticalDotsIcon} from "@/app/components/icons/VerticalDotsIcon";
import Link from "next/link";
import {ChevronCircleTopLinearIcon, ClockCircleLinearIcon, LockFilledIcon} from "@nextui-org/shared-icons";
import {redirect} from "next/navigation";

export default function BuildingTable() {
    const [buildings, setBuilding] = useState<Building[]>([]);
    useEffect(() => {
        const fetchBuildings = async () => {
            try {
                const buildingsCollectionRef = collection(db, "buildings");
                const querySnapshot = await getDocs(query(buildingsCollectionRef,orderBy("id_en")));
                const buildingsArr : any[] = []; //Firebase snapshot
                querySnapshot.forEach((doc) => {
                    // Build your buildings array using document data and IDs
                    buildingsArr.push({ ...doc.data(), id: doc.id });
                });
                // Set your buildings state with all fetched buildings
                setBuilding(buildingsArr);
            } catch (error) {
                console.error("Error fetching buildings:", error);
            }
        };

        fetchBuildings();
    }, []);
    console.log("Current Buildings State:", buildings);
    const [filterValue, setFilterValue] = React.useState("");
    const [selectedKeys, setSelectedKeys] = React.useState<Selection>(new Set([]));
    const [visibleColumns, setVisibleColumns] = React.useState<Selection>(new Set(INITIAL_VISIBLE_COLUMNS));
   const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
        column: "id_en",
        direction: "ascending",
    });

    const [page, setPage] = React.useState(1);

    const hasSearchFilter = Boolean(filterValue);

    const headerColumns = React.useMemo(() => {
        if (visibleColumns === "all") return columns;

        return columns.filter((column) => Array.from(visibleColumns).includes(column.name));
    }, [visibleColumns]);

    const filteredItems = React.useMemo(() => {
        let filteredBuildings = [...buildings];

        if (hasSearchFilter) {
            filteredBuildings = filteredBuildings.filter((building) =>
                (building.id_en+"").includes(filterValue)
            );
        }

        return filteredBuildings;
    }, [buildings, filterValue]);

    const pages = Math.ceil(filteredItems.length / rowsPerPage);

    const items = React.useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;

        return filteredItems.slice(start, end);
    }, [page, filteredItems, rowsPerPage]);

    const sortedItems = React.useMemo(() => {
        return [...items].sort((a: Building, b: Building) => {
            const first = a[sortDescriptor.column as keyof Building] as number;
            const second = b[sortDescriptor.column as keyof Building] as number;
            const cmp = first < second ? -1 : first > second ? 1 : 0;

            return sortDescriptor.direction === "descending" ? -cmp : cmp;
        });
    }, [sortDescriptor, items]);

    const renderCell = React.useCallback((building: Building, columnKey: React.Key) => {
        const cellValue = building[columnKey as keyof Building];
        switch (columnKey) {
            case "id_en":
                return (
                    <h1>{building.id_mm}</h1>
                );
            case "name":
                return (
                    <h1>{building.name}</h1>
                );
            case "donor":
                return (
                    <h1 className="">{building.donor}</h1>
                );
            case "Actions":
                return (
                    <Link href={`buildings/${building.id}`} target="_blank" rel="noopener noreferrer">
                        <Button className="bg-amber-200" size={"sm"} variant={"shadow"} endContent={<VerticalDotsIcon />}>
                            အသေးစိတ်
                        </Button>
                    </Link>
                    // <div className="relative flex justify-end items-center gap-2">
                    //     <Dropdown>
                    //         <DropdownTrigger>
                    //             <Button isIconOnly size="sm" variant="light">
                    //                 <VerticalDotsIcon className="text-default-300" />
                    //             </Button>
                    //         </DropdownTrigger>
                    //         <DropdownMenu>
                    //             <DropdownItem>View</DropdownItem>
                    //             <DropdownItem>Edit</DropdownItem>
                    //             <DropdownItem>Delete</DropdownItem>
                    //         </DropdownMenu>
                    //     </Dropdown>
                    // </div>
                );
            default:
                return cellValue;
        }
    }, []);

    const onNextPage = React.useCallback(() => {
        if (page < pages) {
            setPage(page + 1);
        }
    }, [page, pages]);

    const onPreviousPage = React.useCallback(() => {
        if (page > 1) {
            setPage(page - 1);
        }
    }, [page]);

    const onRowsPerPageChange = React.useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        setRowsPerPage(Number(e.target.value));
        setPage(1);
    }, []);

    const onSearchChange = React.useCallback((value?: string) => {
        if (value) {
            setFilterValue(value);
            setPage(1);
        } else {
            setFilterValue("");
        }
    }, []);

    const onClear = React.useCallback(()=>{
        setFilterValue("")
        setPage(1)
    },[])

    const topContent = React.useMemo(() => {
        return (
            <div className="flex flex-col gap-4 max-h-full">
                <div className="flex justify-between gap-3 items-end">
                    <Input
                        isClearable
                        className="w-full sm:max-w-[44%]"
                        placeholder="Search by number..."
                        startContent={<SearchIcon />}
                        value={filterValue}
                        onClear={() => onClear()}
                        onValueChange={onSearchChange}
                    />
                    <div className="flex gap-3">
                        {/*<Dropdown>*/}
                        {/*    <DropdownTrigger className="hidden sm:flex">*/}
                        {/*        <Button endContent={<ChevronDownIcon className="text-small" />} variant="flat">*/}
                        {/*            Status*/}
                        {/*        </Button>*/}
                        {/*    </DropdownTrigger>*/}
                        {/*    <DropdownMenu*/}
                        {/*        disallowEmptySelection*/}
                        {/*        aria-label="Table Columns"*/}
                        {/*        closeOnSelect={false}*/}
                        {/*        selectedKeys={statusFilter}*/}
                        {/*        selectionMode="multiple"*/}
                        {/*        onSelectionChange={setStatusFilter}*/}
                        {/*    >*/}
                        {/*        {statusOptions.map((status) => (*/}
                        {/*            <DropdownItem key={status.uid} className="capitalize">*/}
                        {/*                {capitalize(status.name)}*/}
                        {/*            </DropdownItem>*/}
                        {/*        ))}*/}
                        {/*    </DropdownMenu>*/}
                        {/*</Dropdown>*/}
                        {/*<Dropdown>*/}
                        {/*    <DropdownTrigger className="hidden sm:flex">*/}
                        {/*        <Button endContent={<ChevronDownIcon className="text-small" />} variant="flat">*/}
                        {/*            Columns*/}
                        {/*        </Button>*/}
                        {/*    </DropdownTrigger>*/}
                        {/*    <DropdownMenu*/}
                        {/*        disallowEmptySelection*/}
                        {/*        aria-label="Table Columns"*/}
                        {/*        closeOnSelect={false}*/}
                        {/*        selectedKeys={visibleColumns}*/}
                        {/*        selectionMode="multiple"*/}
                        {/*        onSelectionChange={setVisibleColumns}*/}
                        {/*    >*/}
                        {/*        {columns.map((column) => (*/}
                        {/*            <DropdownItem key={column.uid} className="capitalize">*/}
                        {/*                {capitalize(column.name)}*/}
                        {/*            </DropdownItem>*/}
                        {/*        ))}*/}
                        {/*    </DropdownMenu>*/}
                        {/*</Dropdown>*/}

                        <Link href={"buildings/create"} target={"_blank"}>

                            <Button className="bg-amber-500 text-white" variant={"shadow"} size={"md"} endContent={<PlusIcon />}>
                                အဆောင်အသစ်ထည့်မည်
                            </Button>
                        </Link>
                        <Link href={"/"}>
                        <Button className="bg-red-400 text-white" variant={"shadow"} size={"md"} endContent={<LockFilledIcon />} onClick={()=>{
                            localStorage.removeItem("isLoggedIn");
                        }}>
                            Log Out
                        </Button>
                        </Link>
                    </div>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-default-400 text-small">Total {buildings.length} buildings</span>
                    <label className="flex items-center text-default-400 text-small">
                        Rows per page:
                        <select
                            className="bg-transparent outline-none text-default-400 text-small"
                            onChange={onRowsPerPageChange}
                        >
                            <option value="5">5</option>
                            <option value="10">10</option>
                            <option value="15">15</option>
                        </select>
                    </label>
                </div>
            </div>
        );
    }, [
        filterValue,
        visibleColumns,
        onSearchChange,
        onRowsPerPageChange,
        buildings.length,
        hasSearchFilter,
    ]);

    const bottomContent = React.useMemo(() => {
        return (
            <div className="py-2 px-2 flex justify-between items-center">
        <span className="w-[30%] text-small text-default-400">
          {/*{selectedKeys === "all"*/}
          {/*    ? "All items selected"*/}
          {/*    : `${selectedKeys.size} of ${filteredItems.length} selected`}*/}
        </span>
                <Pagination

                    isCompact
                    showControls
                    showShadow
                    color = "warning"
                    page={page}
                    total={pages}
                    onChange={setPage}
                />
                <div className="hidden sm:flex w-[30%] justify-end gap-2">
                    <Button isDisabled={pages === 1} size="md" variant="faded" onPress={onPreviousPage}>
                        Previous
                    </Button>
                    <Button isDisabled={pages === 1} size="md" variant="faded" onPress={onNextPage}>
                        Next
                    </Button>
                </div>
            </div>
        );
    }, [selectedKeys, items.length, page, pages, hasSearchFilter]);

    return (
        <Table
            aria-label="Example table with custom cells, pagination and sorting"
            isHeaderSticky
            bottomContent={bottomContent}
            bottomContentPlacement="outside"
            classNames={{
                wrapper: "max-h-full",
                base : "max-h-full",
            }}
            sortDescriptor={sortDescriptor}
            topContent={topContent}
            topContentPlacement="outside"
            onSelectionChange={setSelectedKeys}
            onSortChange={setSortDescriptor}
        >
            <TableHeader columns={headerColumns}>
                {(column) => (
                    <TableColumn
                        key={column.uid}
                        align={column.uid === "actions" ? "center" : "start"}
                        allowsSorting={column.sortable}
                    >
                        {column.name}
                    </TableColumn>
                )}
            </TableHeader>
            <TableBody emptyContent={<Spinner color={"warning"}>
                အချက်အလက်များရယူနေသည်။
                ကြာနေပါက Refresh ကိုနှိပ်ပါ
                <br/>
                <Link href={"/buildings"}>
                    <Button className="bg-amber-500 text-white mt-10 animate-bounce" size={"md"} variant={"shadow"} type={"submit"}
                            endContent={<ClockCircleLinearIcon/>}>
                        Refresh
                    </Button>
                </Link>
            </Spinner>} items={sortedItems}>
                {(item) => (
                    <TableRow key={item.id}>
                        {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
}
