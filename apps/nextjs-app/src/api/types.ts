/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable prettier/prettier */

/** OneOf type helpers */
type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };
type XOR<T, U> = (T | U) extends object ? (Without<T, U> & U) | (Without<U, T> & T) : T | U;
type OneOf<T extends any[]> = T extends [infer Only] ? Only : T extends [infer A, infer B, ...infer Rest] ? OneOf<[XOR<A, B>, ...Rest]> : never;

export interface paths {
  "/table/{tableId}/record/{recordId}": {
    /**
     * Get record
     * @description Retrieve a single record by its ID with options to specify field projections and output format.
     */
    get: {
      parameters: {
        query?: {
          projection?: string[];
          cellFormat?: "json" | "text";
          /** @description Define the key type of record.fields[key], You can click "systemInfo" in the field edit box to get fieldId or enter the table design screen with all the field details */
          fieldKeyType?: "id" | "name" | "dbFieldName";
        };
        path: {
          tableId: string;
          recordId: string;
        };
      };
      responses: {
        /** @description Success */
        200: {
          content: {
            "application/json": {
              /** @description The record id. */
              id: string;
              /** @description primary field value */
              name?: string;
              /** @description Objects with a fields key mapping fieldId or field name to value for that field. */
              fields: {
                [key: string]: unknown;
              };
              /** @description Auto number, a unique identifier for each record */
              autoNumber?: number;
              /** @description Created time, date ISO string (new Date().toISOString). */
              createdTime?: string;
              /** @description Last modified time, date ISO string (new Date().toISOString). */
              lastModifiedTime?: string;
              /** @description Created by, user name */
              createdBy?: string;
              /** @description Last modified by, user name */
              lastModifiedBy?: string;
              /** @description Permissions for the record */
              permissions?: {
                [key: string]: {
                  [key: string]: boolean;
                };
              };
              /** @description Whether the record is undeletable */
              undeletable?: boolean;
            };
          };
        };
      };
    };
    /**
     * Delete record
     * @description Permanently delete a single record by its ID.
     */
    delete: {
      parameters: {
        path: {
          tableId: string;
          recordId: string;
        };
      };
      responses: {
        /** @description Deleted successfully */
        200: {
          content: never;
        };
      };
    };
    /**
     * Update record
     * @description Update a single record by its ID with support for field value typecast and record reordering.
     */
    patch: {
      parameters: {
        path: {
          tableId: string;
          recordId: string;
        };
      };
      requestBody?: {
        content: {
          "application/json": {
            /**
             * @description Define the key type of record.fields[key], You can click "systemInfo" in the field edit box to get fieldId or enter the table design screen with all the field details
             * @default name
             * @enum {string}
             */
            fieldKeyType?: "id" | "name" | "dbFieldName";
            /** @description Automatic data conversion from cellValues if the typecast parameter is passed in. Automatic conversion is disabled by default to ensure data integrity, but it may be helpful for integrating with 3rd party data sources. */
            typecast?: boolean;
            record: {
              /** @description Objects with a fields key mapping fieldId or field name to value for that field. */
              fields: {
                [key: string]: unknown;
              };
            };
            /** @description Where this record to insert to (Optional) */
            order?: {
              /** @description You can only specify order in one view when create record (will create a order index automatically) */
              viewId: string;
              /** @description The record id to anchor to */
              anchorId: string;
              /** @enum {string} */
              position: "before" | "after";
            };
          };
        };
      };
      responses: {
        /** @description Returns record data after update. */
        200: {
          content: {
            "application/json": {
              /** @description The record id. */
              id: string;
              /** @description primary field value */
              name?: string;
              /** @description Objects with a fields key mapping fieldId or field name to value for that field. */
              fields: {
                [key: string]: unknown;
              };
              /** @description Auto number, a unique identifier for each record */
              autoNumber?: number;
              /** @description Created time, date ISO string (new Date().toISOString). */
              createdTime?: string;
              /** @description Last modified time, date ISO string (new Date().toISOString). */
              lastModifiedTime?: string;
              /** @description Created by, user name */
              createdBy?: string;
              /** @description Last modified by, user name */
              lastModifiedBy?: string;
              /** @description Permissions for the record */
              permissions?: {
                [key: string]: {
                  [key: string]: boolean;
                };
              };
              /** @description Whether the record is undeletable */
              undeletable?: boolean;
            };
          };
        };
      };
    };
  };
  "/table/{tableId}/record": {
    /**
     * List records
     * @description Retrieve a list of records with support for filtering, sorting, grouping, and pagination. The response includes record data and optional group information.
     */
    get: {
      parameters: {
        query?: {
          projection?: string[];
          cellFormat?: "json" | "text";
          /** @description Define the key type of record.fields[key], You can click "systemInfo" in the field edit box to get fieldId or enter the table design screen with all the field details */
          fieldKeyType?: "id" | "name" | "dbFieldName";
          viewId?: string;
          ignoreViewQuery?: string | boolean;
          filterByTql?: string;
          filter?: string;
          search?: string[] | ((string | (string | boolean))[]);
          filterLinkCellCandidate?: string[] | string;
          filterLinkCellSelected?: string[] | string;
          selectedRecordIds?: string[];
          orderBy?: string;
          groupBy?: string;
          collapsedGroupIds?: string;
          queryId?: string;
          take?: string | number;
          skip?: string | number;
        };
        path: {
          tableId: string;
        };
      };
      responses: {
        /** @description List of records */
        200: {
          content: {
            "application/json": {
              /**
               * @description Array of record objects
               * @example [
               *   {
               *     "id": "recXXXXXXX",
               *     "fields": {
               *       "single line text": "text value"
               *     }
               *   }
               * ]
               */
              records: {
                  /** @description The record id. */
                  id: string;
                  /** @description primary field value */
                  name?: string;
                  /** @description Objects with a fields key mapping fieldId or field name to value for that field. */
                  fields: {
                    [key: string]: unknown;
                  };
                  /** @description Auto number, a unique identifier for each record */
                  autoNumber?: number;
                  /** @description Created time, date ISO string (new Date().toISOString). */
                  createdTime?: string;
                  /** @description Last modified time, date ISO string (new Date().toISOString). */
                  lastModifiedTime?: string;
                  /** @description Created by, user name */
                  createdBy?: string;
                  /** @description Last modified by, user name */
                  lastModifiedBy?: string;
                  /** @description Permissions for the record */
                  permissions?: {
                    [key: string]: {
                      [key: string]: boolean;
                    };
                  };
                  /** @description Whether the record is undeletable */
                  undeletable?: boolean;
                }[];
              extra?: {
                /** @description Group points for the view */
                groupPoints?: (({
                    id: string;
                    /** @enum {number} */
                    type: 0;
                    depth: number;
                    value?: unknown;
                    isCollapsed: boolean;
                  } | {
                    /** @enum {number} */
                    type: 1;
                    count: number;
                  })[]) | null;
                /** @description All group header refs for the view, including collapsed group headers */
                allGroupHeaderRefs?: {
                    id: string;
                    depth: number;
                  }[];
              };
            };
          };
        };
      };
    };
    /**
     * Create records
     * @description Create one or multiple records with support for field value typecast and custom record ordering.
     */
    post: {
      parameters: {
        path: {
          tableId: string;
        };
      };
      requestBody?: {
        content: {
          "application/json": {
            /**
             * @description Define the key type of record.fields[key], You can click "systemInfo" in the field edit box to get fieldId or enter the table design screen with all the field details
             * @default name
             * @enum {string}
             */
            fieldKeyType?: "id" | "name" | "dbFieldName";
            /** @description Automatic data conversion from cellValues if the typecast parameter is passed in. Automatic conversion is disabled by default to ensure data integrity, but it may be helpful for integrating with 3rd party data sources. */
            typecast?: boolean;
            /** @description Where this record to insert to (Optional) */
            order?: {
              /** @description You can only specify order in one view when create record (will create a order index automatically) */
              viewId: string;
              /** @description The record id to anchor to */
              anchorId: string;
              /** @enum {string} */
              position: "before" | "after";
            };
            /**
             * @description Array of record objects
             * @example [
             *   {
             *     "fields": {
             *       "single line text": "text value"
             *     }
             *   }
             * ]
             */
            records: {
                /** @description Objects with a fields key mapping fieldId or field name to value for that field. */
                fields: {
                  [key: string]: unknown;
                };
              }[];
          };
        };
      };
      responses: {
        /** @description Returns data about the records. */
        201: {
          content: {
            "application/json": {
              /**
               * @description Array of record objects
               * @example [
               *   {
               *     "id": "recXXXXXXX",
               *     "fields": {
               *       "single line text": "text value"
               *     }
               *   }
               * ]
               */
              records: {
                  /** @description The record id. */
                  id: string;
                  /** @description primary field value */
                  name?: string;
                  /** @description Objects with a fields key mapping fieldId or field name to value for that field. */
                  fields: {
                    [key: string]: unknown;
                  };
                  /** @description Auto number, a unique identifier for each record */
                  autoNumber?: number;
                  /** @description Created time, date ISO string (new Date().toISOString). */
                  createdTime?: string;
                  /** @description Last modified time, date ISO string (new Date().toISOString). */
                  lastModifiedTime?: string;
                  /** @description Created by, user name */
                  createdBy?: string;
                  /** @description Last modified by, user name */
                  lastModifiedBy?: string;
                  /** @description Permissions for the record */
                  permissions?: {
                    [key: string]: {
                      [key: string]: boolean;
                    };
                  };
                  /** @description Whether the record is undeletable */
                  undeletable?: boolean;
                }[];
            };
          };
        };
      };
    };
    /**
     * Delete records
     * @description Permanently delete multiple records by their IDs in a single request.
     */
    delete: {
      parameters: {
        query: {
          recordIds: string[];
        };
        path: {
          tableId: string;
        };
      };
      responses: {
        /** @description Deleted successfully */
        200: {
          content: never;
        };
      };
    };
    /**
     * Update multiple records
     * @description Update multiple records in a single request with support for field value typecast and record reordering.
     */
    patch: {
      parameters: {
        path: {
          tableId: string;
        };
      };
      requestBody?: {
        content: {
          "application/json": {
            /**
             * @description Define the key type of record.fields[key], You can click "systemInfo" in the field edit box to get fieldId or enter the table design screen with all the field details
             * @default name
             * @enum {string}
             */
            fieldKeyType?: "id" | "name" | "dbFieldName";
            /** @description Automatic data conversion from cellValues if the typecast parameter is passed in. Automatic conversion is disabled by default to ensure data integrity, but it may be helpful for integrating with 3rd party data sources. */
            typecast?: boolean;
            records: {
                id: string;
                /** @description Objects with a fields key mapping fieldId or field name to value for that field. */
                fields: {
                  [key: string]: unknown;
                };
              }[];
            /** @description Where this record to insert to (Optional) */
            order?: {
              /** @description You can only specify order in one view when create record (will create a order index automatically) */
              viewId: string;
              /** @description The record id to anchor to */
              anchorId: string;
              /** @enum {string} */
              position: "before" | "after";
            };
          };
        };
      };
      responses: {
        /** @description Returns the records data after update. */
        200: {
          content: {
            "application/json": {
                /** @description The record id. */
                id: string;
                /** @description primary field value */
                name?: string;
                /** @description Objects with a fields key mapping fieldId or field name to value for that field. */
                fields: {
                  [key: string]: unknown;
                };
                /** @description Auto number, a unique identifier for each record */
                autoNumber?: number;
                /** @description Created time, date ISO string (new Date().toISOString). */
                createdTime?: string;
                /** @description Last modified time, date ISO string (new Date().toISOString). */
                lastModifiedTime?: string;
                /** @description Created by, user name */
                createdBy?: string;
                /** @description Last modified by, user name */
                lastModifiedBy?: string;
                /** @description Permissions for the record */
                permissions?: {
                  [key: string]: {
                    [key: string]: boolean;
                  };
                };
                /** @description Whether the record is undeletable */
                undeletable?: boolean;
              }[];
          };
        };
      };
    };
  };
  "/table/{tableId}/record/{recordId}/duplicate": {
    /**
     * Duplicate record
     * @description Create a copy of an existing record with optional custom positioning in the view.
     */
    post: {
      parameters: {
        path: {
          tableId: string;
          recordId: string;
        };
      };
      requestBody?: {
        content: {
          "application/json": {
            /** @description You can only specify order in one view when create record (will create a order index automatically) */
            viewId: string;
            /** @description The record id to anchor to */
            anchorId: string;
            /** @enum {string} */
            position: "before" | "after";
          };
        };
      };
      responses: {
        /** @description Successful duplicate */
        201: {
          content: {
            "application/json": {
              /**
               * @description Array of record objects
               * @example [
               *   {
               *     "id": "recXXXXXXX",
               *     "fields": {
               *       "single line text": "text value"
               *     }
               *   }
               * ]
               */
              records: {
                  /** @description The record id. */
                  id: string;
                  /** @description primary field value */
                  name?: string;
                  /** @description Objects with a fields key mapping fieldId or field name to value for that field. */
                  fields: {
                    [key: string]: unknown;
                  };
                  /** @description Auto number, a unique identifier for each record */
                  autoNumber?: number;
                  /** @description Created time, date ISO string (new Date().toISOString). */
                  createdTime?: string;
                  /** @description Last modified time, date ISO string (new Date().toISOString). */
                  lastModifiedTime?: string;
                  /** @description Created by, user name */
                  createdBy?: string;
                  /** @description Last modified by, user name */
                  lastModifiedBy?: string;
                  /** @description Permissions for the record */
                  permissions?: {
                    [key: string]: {
                      [key: string]: boolean;
                    };
                  };
                  /** @description Whether the record is undeletable */
                  undeletable?: boolean;
                }[];
            };
          };
        };
      };
    };
  };
  "/space": {
    /**
     * Get space list
     * @description Get space list by query
     */
    get: {
      responses: {
        /** @description Returns the list of space. */
        200: {
          content: {
            "application/json": ({
                id: string;
                name: string;
                /** @enum {string} */
                role: "owner" | "creator" | "editor" | "commenter" | "viewer";
                organization?: {
                  id: string;
                  name: string;
                };
              })[];
          };
        };
      };
    };
    /** @description Create a space */
    post: {
      requestBody?: {
        content: {
          "application/json": {
            name?: string;
          };
        };
      };
      responses: {
        /** @description Returns information about a successfully created space. */
        201: {
          content: {
            "application/json": {
              id: string;
              name: string;
            };
          };
        };
      };
    };
  };
  "/space/{spaceId}": {
    /** @description Get a space by spaceId */
    get: {
      parameters: {
        path: {
          spaceId: string;
        };
      };
      responses: {
        /** @description Returns information about a space. */
        200: {
          content: {
            "application/json": {
              id: string;
              name: string;
              /** @enum {string} */
              role: "owner" | "creator" | "editor" | "commenter" | "viewer";
              organization?: {
                id: string;
                name: string;
              };
            };
          };
        };
      };
    };
    /** @description Delete a space by spaceId */
    delete: {
      parameters: {
        path: {
          spaceId: string;
        };
      };
      responses: {
        /** @description Deleted successfully */
        200: {
          content: never;
        };
      };
    };
    /** @description Update a space info */
    patch: {
      parameters: {
        path: {
          spaceId: string;
        };
      };
      requestBody?: {
        content: {
          "application/json": {
            name?: string;
          };
        };
      };
      responses: {
        /** @description Returns information about a successfully updated space. */
        200: {
          content: {
            "application/json": {
              id: string;
              name: string;
            };
          };
        };
      };
    };
  };
  "/space/{spaceId}/invitation/link": {
    /** @description List a invitation link to your */
    get: {
      parameters: {
        path: {
          spaceId: string;
        };
      };
      responses: {
        /** @description Successful response, return invitation information list. */
        200: {
          content: {
            "application/json": ({
                invitationId: string;
                /** @enum {string} */
                role: "owner" | "creator" | "editor" | "commenter" | "viewer";
                inviteUrl: string;
                invitationCode: string;
                createdBy: string;
                createdTime: string;
              })[];
          };
        };
      };
    };
    /** @description Create a invitation link to your */
    post: {
      parameters: {
        path: {
          spaceId: string;
        };
      };
      requestBody?: {
        content: {
          "application/json": {
            /** @enum {string} */
            role: "owner" | "creator" | "editor" | "commenter" | "viewer";
          };
        };
      };
      responses: {
        /** @description Successful response, return the ID of the invitation link. */
        201: {
          content: {
            "application/json": {
              invitationId: string;
              /** @enum {string} */
              role: "owner" | "creator" | "editor" | "commenter" | "viewer";
              inviteUrl: string;
              invitationCode: string;
              createdBy: string;
              createdTime: string;
            };
          };
        };
      };
    };
  };
  "/space/{spaceId}/invitation/link/{invitationId}": {
    /** @description Delete a invitation link to your */
    delete: {
      parameters: {
        path: {
          spaceId: string;
          invitationId: string;
        };
      };
      responses: {
        /** @description Successful response. */
        200: {
          content: never;
        };
      };
    };
    /** @description Update a invitation link to your */
    patch: {
      parameters: {
        path: {
          invitationId: string;
          spaceId: string;
        };
      };
      requestBody?: {
        content: {
          "application/json": {
            /** @enum {string} */
            role: "owner" | "creator" | "editor" | "commenter" | "viewer";
          };
        };
      };
      responses: {
        /** @description Successful response. */
        200: {
          content: {
            "application/json": {
              invitationId: string;
              /** @enum {string} */
              role: "owner" | "creator" | "editor" | "commenter" | "viewer";
            };
          };
        };
      };
    };
  };
  "/space/{spaceId}/invitation/email": {
    /** @description Send invitations by e-mail */
    post: {
      parameters: {
        path: {
          spaceId: string;
        };
      };
      requestBody?: {
        content: {
          "application/json": {
            emails: string[];
            /** @enum {string} */
            role: "owner" | "creator" | "editor" | "commenter" | "viewer";
          };
        };
      };
      responses: {
        /** @description Successful response, return invitation information. */
        201: {
          content: {
            "application/json": {
              [key: string]: {
                invitationId: string;
              };
            };
          };
        };
      };
    };
  };
  "/space/{spaceId}/collaborators": {
    /** @description List a space collaborator */
    get: {
      parameters: {
        query?: {
          includeSystem?: boolean | null;
          includeBase?: boolean | null;
          skip?: number | null;
          take?: number | null;
          search?: string;
          type?: "user" | "department";
          orderBy?: "desc" | "asc";
        };
        path: {
          spaceId: string;
        };
      };
      responses: {
        /** @description Successful response, return space collaborator list. */
        200: {
          content: {
            "application/json": {
              collaborators: (OneOf<[{
                  userId: string;
                  userName: string;
                  email: string;
                  /** @enum {string} */
                  role: "owner" | "creator" | "editor" | "commenter" | "viewer";
                  avatar: string | null;
                  createdTime: string;
                  /** @enum {string} */
                  type: "user";
                  /** @enum {string} */
                  resourceType: "space" | "base";
                  isSystem?: boolean;
                  billable?: boolean;
                  base?: {
                    id: string;
                    name: string;
                  };
                }, {
                  departmentId: string;
                  departmentName: string;
                  /** @enum {string} */
                  role: "owner" | "creator" | "editor" | "commenter" | "viewer";
                  createdTime: string;
                  /** @enum {string} */
                  type: "department";
                  /** @enum {string} */
                  resourceType: "space" | "base";
                  base?: {
                    id: string;
                    name: string;
                  };
                }]>)[];
              uniqTotal: number;
              total: number;
            };
          };
        };
      };
    };
    /** @description Delete a collaborator */
    delete: {
      parameters: {
        query: {
          principalId: string;
          principalType: "user" | "department";
        };
        path: {
          spaceId: string;
        };
      };
      responses: {
        /** @description Successful response. */
        200: {
          content: never;
        };
      };
    };
    /** @description Update a space collaborator */
    patch: {
      parameters: {
        path: {
          invitationId: string;
          spaceId: string;
        };
      };
      requestBody?: {
        content: {
          "application/json": {
            principalId: string;
            /** @enum {string} */
            principalType: "user" | "department";
            /** @enum {string} */
            role: "owner" | "creator" | "editor" | "commenter" | "viewer";
          };
        };
      };
      responses: {
        /** @description Successful response. */
        200: {
          content: never;
        };
      };
    };
  };
  "/base": {
    /** @description Create a base */
    post: {
      requestBody?: {
        content: {
          "application/json": {
            spaceId: string;
            name?: string;
            icon?: string;
          };
        };
      };
      responses: {
        /** @description Returns information about a successfully created base. */
        201: {
          content: {
            "application/json": {
              id: string;
              name: string;
              spaceId: string;
            };
          };
        };
      };
    };
  };
  "/base/{baseId}": {
    /** @description Get a base by baseId */
    get: {
      parameters: {
        path: {
          baseId: string;
        };
      };
      responses: {
        /** @description Returns information about a base. */
        200: {
          content: {
            "application/json": {
              id: string;
              name: string;
              spaceId: string;
              icon: string | null;
              /** @enum {string} */
              role: "owner" | "creator" | "editor" | "commenter" | "viewer";
              /** @enum {string} */
              collaboratorType?: "space" | "base";
              restrictedAuthority?: boolean;
            };
          };
        };
      };
    };
    /** @description Delete a base by baseId */
    delete: {
      parameters: {
        path: {
          baseId: string;
        };
      };
      responses: {
        /** @description Deleted successfully */
        200: {
          content: never;
        };
      };
    };
    /** @description Update a base info */
    patch: {
      parameters: {
        path: {
          baseId: string;
        };
      };
      requestBody?: {
        content: {
          "application/json": {
            name?: string;
            icon?: string;
          };
        };
      };
      responses: {
        /** @description Returns information about a successfully updated base. */
        200: {
          content: {
            "application/json": {
              spaceId: string;
              name: string;
              icon?: string | null;
            };
          };
        };
      };
    };
  };
  "/table/{tableId}/view/{viewId}/order": {
    /** @description Update view order */
    put: {
      parameters: {
        path: {
          tableId: string;
          viewId: string;
        };
      };
      requestBody?: {
        content: {
          "application/json": {
            anchorId: string;
            /** @enum {string} */
            position: "before" | "after";
          };
        };
      };
      responses: {
        /** @description Successfully update. */
        200: {
          content: never;
        };
      };
    };
  };
  "/base/{baseId}/order": {
    /** @description Update base order */
    put: {
      parameters: {
        path: {
          baseId: string;
        };
      };
      requestBody?: {
        content: {
          "application/json": {
            anchorId: string;
            /** @enum {string} */
            position: "before" | "after";
          };
        };
      };
      responses: {
        /** @description Successfully update. */
        200: {
          content: never;
        };
      };
    };
  };
  "/base/access/all": {
    /** @description Get base list by query */
    get: {
      responses: {
        /** @description Returns the list of base. */
        200: {
          content: {
            "application/json": ({
                id: string;
                name: string;
                spaceId: string;
                icon: string | null;
                /** @enum {string} */
                role: "owner" | "creator" | "editor" | "commenter" | "viewer";
                /** @enum {string} */
                collaboratorType?: "space" | "base";
                restrictedAuthority?: boolean;
              })[];
          };
        };
      };
    };
  };
  "/base/{baseId}/collaborators": {
    /** @description List a base collaborator */
    get: {
      parameters: {
        query?: {
          includeSystem?: boolean | null;
          skip?: number | null;
          take?: number | null;
          search?: string;
          type?: "user" | "department";
        };
        path: {
          baseId: string;
        };
      };
      responses: {
        /** @description Successful response, return base collaborator list. */
        200: {
          content: {
            "application/json": {
              collaborators: (OneOf<[{
                  userId: string;
                  userName: string;
                  email: string;
                  /** @enum {string} */
                  role: "owner" | "creator" | "editor" | "commenter" | "viewer";
                  avatar: string | null;
                  createdTime: string;
                  /** @enum {string} */
                  type: "user";
                  /** @enum {string} */
                  resourceType: "space" | "base";
                  isSystem?: boolean;
                  billable?: boolean;
                  base?: {
                    id: string;
                    name: string;
                  };
                }, {
                  departmentId: string;
                  departmentName: string;
                  /** @enum {string} */
                  role: "owner" | "creator" | "editor" | "commenter" | "viewer";
                  createdTime: string;
                  /** @enum {string} */
                  type: "department";
                  /** @enum {string} */
                  resourceType: "space" | "base";
                  base?: {
                    id: string;
                    name: string;
                  };
                }]>)[];
              total: number;
            };
          };
        };
      };
    };
    /** @description Delete a base collaborators */
    delete: {
      parameters: {
        query: {
          principalId: string;
          principalType: "user" | "department";
        };
        path: {
          baseId: string;
        };
      };
      responses: {
        /** @description Successful response. */
        200: {
          content: never;
        };
      };
    };
    /** @description Update a base collaborator */
    patch: {
      parameters: {
        path: {
          invitationId: string;
          baseId: string;
        };
      };
      requestBody?: {
        content: {
          "application/json": {
            principalId: string;
            /** @enum {string} */
            principalType: "user" | "department";
            /** @enum {string} */
            role: "creator" | "editor" | "commenter" | "viewer";
          };
        };
      };
      responses: {
        /** @description Successful response. */
        200: {
          content: never;
        };
      };
    };
  };
  "/base/duplicate": {
    /** @description duplicate a base */
    post: {
      parameters: {
        path: {
          baseId: string;
        };
      };
      requestBody?: {
        content: {
          "application/json": {
            /** @description The base to duplicate */
            fromBaseId: string;
            /** @description The space to duplicate the base to */
            spaceId: string;
            /** @description Whether to duplicate the records */
            withRecords?: boolean;
            /** @description The name of the duplicated base */
            name?: string;
            baseId?: string;
          };
        };
      };
      responses: {
        /** @description Returns information about a successfully duplicated base. */
        201: {
          content: {
            "application/json": {
              id: string;
              name: string;
              spaceId: string;
            };
          };
        };
      };
    };
  };
  "/base/create-from-template": {
    /**
     * Create a base from template or apply a template to a base
     * @description Create a base from template or apply a template to a base
     */
    post: {
      requestBody?: {
        content: {
          "application/json": {
            /** @description The space id to create a base from */
            spaceId: string;
            /** @description The template id to create a base from */
            templateId: string;
            /** @description Whether to create records from the template */
            withRecords?: boolean;
            /** @description The base id to apply the template to */
            baseId?: string;
          };
        };
      };
      responses: {
        /** @description Returns information about a successfully created base. */
        201: {
          content: {
            "application/json": {
              id: string;
              name: string;
              spaceId: string;
            };
          };
        };
      };
    };
  };
  "/base/{baseId}/permission": {
    /** @description Get a base permission */
    get: {
      parameters: {
        path: {
          baseId: string;
        };
      };
      responses: {
        /** @description Returns data about a base permission. */
        200: {
          content: {
            "application/json": {
              [key: string]: boolean;
            };
          };
        };
      };
    };
  };
  "/base/{baseId}/invitation/link": {
    /** @description List a invitation link to your */
    get: {
      parameters: {
        path: {
          baseId: string;
        };
      };
      responses: {
        /** @description Successful response, return invitation information list. */
        200: {
          content: {
            "application/json": ({
                invitationId: string;
                inviteUrl: string;
                invitationCode: string;
                createdBy: string;
                createdTime: string;
                /** @enum {string} */
                role: "creator" | "editor" | "commenter" | "viewer";
              })[];
          };
        };
      };
    };
    /** @description Create a invitation link to your */
    post: {
      parameters: {
        path: {
          baseId: string;
        };
      };
      requestBody?: {
        content: {
          "application/json": {
            /** @enum {string} */
            role: "creator" | "editor" | "commenter" | "viewer";
          };
        };
      };
      responses: {
        /** @description Successful response, return the ID of the invitation link. */
        201: {
          content: {
            "application/json": {
              invitationId: string;
              inviteUrl: string;
              invitationCode: string;
              createdBy: string;
              createdTime: string;
              /** @enum {string} */
              role: "creator" | "editor" | "commenter" | "viewer";
            };
          };
        };
      };
    };
  };
  "/base/{baseId}/invitation/link/{invitationId}": {
    /** @description Delete a invitation link to your */
    delete: {
      parameters: {
        path: {
          baseId: string;
          invitationId: string;
        };
      };
      responses: {
        /** @description Successful response. */
        200: {
          content: never;
        };
      };
    };
    /** @description Update a invitation link to your */
    patch: {
      parameters: {
        path: {
          invitationId: string;
          baseId: string;
        };
      };
      requestBody?: {
        content: {
          "application/json": {
            /** @enum {string} */
            role: "creator" | "editor" | "commenter" | "viewer";
          };
        };
      };
      responses: {
        /** @description Successful response. */
        200: {
          content: {
            "application/json": {
              invitationId: string;
              /** @enum {string} */
              role: "creator" | "editor" | "commenter" | "viewer";
            };
          };
        };
      };
    };
  };
  "/base/{baseId}/invitation/email": {
    /** @description Send invitations by e-mail */
    post: {
      parameters: {
        path: {
          baseId: string;
        };
      };
      requestBody?: {
        content: {
          "application/json": {
            emails: string[];
            /** @enum {string} */
            role: "creator" | "editor" | "commenter" | "viewer";
          };
        };
      };
      responses: {
        /** @description Successful response, return invitation information. */
        201: {
          content: {
            "application/json": {
              [key: string]: {
                invitationId: string;
              };
            };
          };
        };
      };
    };
  };
  "/base/shared-base": {
    get: {
      responses: {
        /** @description Returns information about a shared base. */
        200: {
          content: {
            "application/json": ({
                id: string;
                name: string;
                spaceId: string;
                icon: string | null;
                /** @enum {string} */
                role: "owner" | "creator" | "editor" | "commenter" | "viewer";
                /** @enum {string} */
                collaboratorType?: "space" | "base";
                restrictedAuthority?: boolean;
                spaceName?: string;
              })[];
          };
        };
      };
    };
  };
  "/base/{baseId}/permanent": {
    /** @description Permanently delete a base by baseId */
    delete: {
      parameters: {
        path: {
          baseId: string;
        };
      };
      responses: {
        /** @description Permanently deleted successfully */
        200: {
          content: never;
        };
      };
    };
  };
  "/space/{spaceId}/collaborator": {
    /** @description Add a collaborator to a space */
    post: {
      parameters: {
        path: {
          spaceId: string;
        };
      };
      requestBody?: {
        content: {
          "application/json": {
            collaborators: ({
                principalId: string;
                /** @enum {string} */
                principalType: "user" | "department";
              })[];
            /** @enum {string} */
            role: "owner" | "creator" | "editor" | "commenter" | "viewer";
          };
        };
      };
      responses: {
        /** @description Successful response. */
        200: {
          content: never;
        };
      };
    };
  };
  "/base/{baseId}/collaborator": {
    /** @description Add a collaborator to a base */
    post: {
      parameters: {
        path: {
          baseId: string;
        };
      };
      requestBody?: {
        content: {
          "application/json": {
            collaborators: ({
                principalId: string;
                /** @enum {string} */
                principalType: "user" | "department";
              })[];
            /** @enum {string} */
            role: "creator" | "editor" | "commenter" | "viewer";
          };
        };
      };
      responses: {
        /** @description Successful response. */
        200: {
          content: never;
        };
      };
    };
  };
  "/base/{baseId}/collaborators/users": {
    /**
     * Get base collaborator user list
     * @description Get base collaborator user list
     */
    get: {
      parameters: {
        query?: {
          search?: string;
          skip?: number | null;
          take?: number | null;
          includeSystem?: boolean | null;
          orderBy?: "desc" | "asc";
        };
        path: {
          baseId: string;
        };
      };
      responses: {
        /** @description Successful response, return base collaborator user list. */
        200: {
          content: {
            "application/json": {
              users: ({
                  id: string;
                  name: string;
                  email: string;
                  avatar?: string | null;
                })[];
              total: number;
            };
          };
        };
      };
    };
  };
  "/base/{baseId}/dashboard": {
    /** @description Get a list of dashboards in base */
    get: {
      parameters: {
        path: {
          baseId: string;
        };
      };
      responses: {
        /** @description Returns data about the dashboards. */
        200: {
          content: {
            "application/json": {
                  id: string;
                  name: string;
                }[][];
          };
        };
      };
    };
    /** @description Create a new dashboard */
    post: {
      parameters: {
        path: {
          baseId: string;
        };
      };
      requestBody?: {
        content: {
          "application/json": {
            name: string;
          };
        };
      };
      responses: {
        /** @description Returns data about the created dashboard. */
        201: {
          content: {
            "application/json": {
              id: string;
              name: string;
            };
          };
        };
      };
    };
  };
  "/base/{baseId}/dashboard/{id}": {
    /** @description Get a dashboard by id */
    get: {
      parameters: {
        path: {
          baseId: string;
          id: string;
        };
      };
      responses: {
        /** @description Returns data about the dashboard. */
        200: {
          content: {
            "application/json": {
              id: string;
              name: string;
              layout?: {
                  pluginInstallId: string;
                  x: number;
                  y: number;
                  w: number;
                  h: number;
                }[];
              pluginMap?: {
                [key: string]: {
                  id: string;
                  pluginInstallId: string;
                  name: string;
                  url?: string;
                };
              };
            };
          };
        };
      };
    };
    /** @description Delete a dashboard by id */
    delete: {
      parameters: {
        path: {
          baseId: string;
          id: string;
        };
      };
      responses: {
        /** @description Dashboard deleted */
        200: {
          content: never;
        };
      };
    };
  };
  "/base/{baseId}/dashboard/{dashboardId}/rename": {
    /** @description Rename a dashboard by id */
    patch: {
      parameters: {
        path: {
          baseId: string;
          dashboardId: string;
        };
      };
      requestBody?: {
        content: {
          "application/json": {
            name: string;
          };
        };
      };
      responses: {
        /** @description Returns data about the renamed dashboard. */
        200: {
          content: {
            "application/json": {
              id: string;
              name: string;
            };
          };
        };
      };
    };
  };
  "/base/{baseId}/dashboard/{id}/layout": {
    /** @description Update a dashboard layout by id */
    patch: {
      parameters: {
        path: {
          baseId: string;
          id: string;
        };
      };
      requestBody?: {
        content: {
          "application/json": {
            layout: {
                pluginInstallId: string;
                x: number;
                y: number;
                w: number;
                h: number;
              }[];
          };
        };
      };
      responses: {
        /** @description Returns data about the updated dashboard layout. */
        200: {
          content: {
            "application/json": {
              id: string;
              layout: {
                  pluginInstallId: string;
                  x: number;
                  y: number;
                  w: number;
                  h: number;
                }[];
            };
          };
        };
      };
    };
  };
  "/base/{baseId}/dashboard/{id}/plugin": {
    /** @description Install a plugin to a dashboard */
    post: {
      parameters: {
        path: {
          baseId: string;
          id: string;
        };
      };
      requestBody?: {
        content: {
          "application/json": {
            name: string;
            pluginId: string;
          };
        };
      };
      responses: {
        /** @description Returns data about the installed plugin. */
        201: {
          content: {
            "application/json": {
              id: string;
              pluginId: string;
              pluginInstallId: string;
              name: string;
            };
          };
        };
      };
    };
  };
  "/base/{baseId}/dashboard/{dashboardId}/plugin/{pluginInstallId}": {
    /** @description Get a dashboard install plugin by id */
    get: {
      parameters: {
        path: {
          baseId: string;
          dashboardId: string;
          pluginInstallId: string;
        };
      };
      responses: {
        /** @description Returns data about the dashboard install plugin. */
        200: {
          content: {
            "application/json": {
              pluginId: string;
              pluginInstallId: string;
              baseId: string;
              name: string;
              storage?: {
                [key: string]: unknown;
              };
            };
          };
        };
      };
    };
    /** @description Remove a plugin from a dashboard */
    delete: {
      parameters: {
        path: {
          baseId: string;
          dashboardId: string;
          pluginInstallId: string;
        };
      };
      responses: {
        /** @description Plugin removed successfully. */
        200: {
          content: never;
        };
      };
    };
  };
  "/base/{baseId}/dashboard/{dashboardId}/plugin/{pluginInstallId}/rename": {
    /** @description Rename a plugin in a dashboard */
    patch: {
      parameters: {
        path: {
          baseId: string;
          id: string;
          pluginInstallId: string;
        };
      };
      requestBody?: {
        content: {
          "application/json": {
            name: string;
          };
        };
      };
      responses: {
        /** @description Returns data about the renamed plugin. */
        200: {
          content: {
            "application/json": {
              id: string;
              pluginInstallId: string;
              name: string;
            };
          };
        };
      };
    };
  };
  "/base/{baseId}/dashboard/{dashboardId}/plugin/{pluginInstallId}/update-storage": {
    /** @description Update storage of a plugin in a dashboard */
    patch: {
      parameters: {
        path: {
          baseId: string;
          dashboardId: string;
          pluginInstallId: string;
        };
      };
      requestBody?: {
        content: {
          "application/json": {
            storage?: {
              [key: string]: unknown;
            };
          };
        };
      };
      responses: {
        /** @description Returns data about the updated plugin. */
        200: {
          content: {
            "application/json": {
              baseId: string;
              dashboardId: string;
              pluginInstallId: string;
              storage?: {
                [key: string]: unknown;
              };
            };
          };
        };
      };
    };
  };
  "/base/{baseId}/dashboard/{id}/duplicate": {
    /**
     * Duplicate a dashboard
     * @description Duplicate a dashboard
     */
    post: {
      parameters: {
        path: {
          baseId: string;
          id: string;
        };
      };
      responses: {
        /** @description Returns the duplicated dashboard info. */
        200: {
          content: {
            "application/json": {
              id: string;
              name: string;
            };
          };
        };
      };
    };
  };
  "/base/{baseId}/dashboard/{id}/plugin/{installedId}/duplicate": {
    /**
     * Duplicate a dashboard installed plugin
     * @description Duplicate a dashboard installed plugin
     */
    post: {
      parameters: {
        path: {
          baseId: string;
          id: string;
        };
      };
      responses: {
        /** @description Returns the duplicated dashboard info. */
        200: {
          content: {
            "application/json": {
              id: string;
              name: string;
            };
          };
        };
      };
    };
  };
  "/plugin": {
    /** @description Get plugins */
    get: {
      responses: {
        /** @description Returns data about the plugins. */
        200: {
          content: {
            "application/json": ({
                id: string;
                name: string;
                description?: string;
                detailDesc?: string;
                logo: string;
                url?: string;
                helpUrl?: string;
                positions: ("dashboard" | "view" | "contextMenu" | "panel")[];
                /**
                 * @example {
                 *   "en": {
                 *     "title": "Plugin title",
                 *     "description": "Plugin description"
                 *   },
                 *   "zh": {
                 *     "title": "插件标题",
                 *     "description": "插件描述"
                 *   }
                 * }
                 */
                i18n: Record<string, never>;
                /** @enum {string} */
                status: "developing" | "reviewing" | "published";
                pluginUser?: {
                  id: string;
                  name: string;
                  /** Format: email */
                  email: string;
                  avatar?: string;
                };
                createdTime: string;
                lastModifiedTime: string;
              })[];
          };
        };
      };
    };
    /** @description Create a plugin */
    post: {
      requestBody?: {
        content: {
          "application/json": {
            name: string;
            description?: string;
            detailDesc?: string;
            logo: string;
            /** Format: uri */
            url?: string;
            config?: {
              contextMenu?: {
                width?: number | string;
                height?: number | string;
                x?: number | string;
                y?: number | string;
                frozenResize?: boolean;
                frozenDrag?: boolean;
              };
              view?: unknown;
              dashboard?: unknown;
              panel?: unknown;
            };
            /** Format: uri */
            helpUrl?: string;
            positions: ("dashboard" | "view" | "contextMenu" | "panel")[];
            /**
             * @example {
             *   "en": {
             *     "title": "Plugin title",
             *     "description": "Plugin description"
             *   },
             *   "zh": {
             *     "title": "插件标题",
             *     "description": "插件描述"
             *   }
             * }
             */
            i18n?: Record<string, never>;
            autoCreateMember?: boolean;
          };
        };
      };
      responses: {
        /** @description Returns data about the plugin. */
        201: {
          content: {
            "application/json": {
              id: string;
              name: string;
              description?: string;
              detailDesc?: string;
              logo: string;
              url?: string;
              config?: {
                contextMenu?: {
                  width?: number | string;
                  height?: number | string;
                  x?: number | string;
                  y?: number | string;
                  frozenResize?: boolean;
                  frozenDrag?: boolean;
                };
                view?: unknown;
                dashboard?: unknown;
                panel?: unknown;
              };
              helpUrl?: string;
              positions: ("dashboard" | "view" | "contextMenu" | "panel")[];
              /**
               * @example {
               *   "en": {
               *     "title": "Plugin title",
               *     "description": "Plugin description"
               *   },
               *   "zh": {
               *     "title": "插件标题",
               *     "description": "插件描述"
               *   }
               * }
               */
              i18n?: Record<string, never>;
              secret: string;
              /** @enum {string} */
              status: "developing" | "reviewing" | "published";
              pluginUser?: {
                id: string;
                name: string;
                /** Format: email */
                email: string;
                avatar?: string;
              };
              createdTime: string;
            };
          };
        };
      };
    };
  };
  "/plugin/{id}": {
    /** @description Update a plugin */
    put: {
      parameters: {
        path: {
          id: string;
        };
      };
      requestBody?: {
        content: {
          "application/json": {
            name: string;
            description?: string;
            detailDesc?: string;
            /** Format: uri */
            url?: string;
            config?: {
              contextMenu?: {
                width?: number | string;
                height?: number | string;
                x?: number | string;
                y?: number | string;
                frozenResize?: boolean;
                frozenDrag?: boolean;
              };
              view?: unknown;
              dashboard?: unknown;
              panel?: unknown;
            };
            logo?: string;
            /** Format: uri */
            helpUrl?: string;
            positions: ("dashboard" | "view" | "contextMenu" | "panel")[];
            /**
             * @example {
             *   "en": {
             *     "title": "Plugin title",
             *     "description": "Plugin description"
             *   },
             *   "zh": {
             *     "title": "插件标题",
             *     "description": "插件描述"
             *   }
             * }
             */
            i18n?: Record<string, never>;
          };
        };
      };
      responses: {
        /** @description Returns data about the plugin. */
        200: {
          content: {
            "application/json": {
              id: string;
              name: string;
              description?: string;
              detailDesc?: string;
              logo: string;
              config?: {
                contextMenu?: {
                  width?: number | string;
                  height?: number | string;
                  x?: number | string;
                  y?: number | string;
                  frozenResize?: boolean;
                  frozenDrag?: boolean;
                };
                view?: unknown;
                dashboard?: unknown;
                panel?: unknown;
              };
              url?: string;
              helpUrl?: string;
              positions: ("dashboard" | "view" | "contextMenu" | "panel")[];
              /**
               * @example {
               *   "en": {
               *     "title": "Plugin title",
               *     "description": "Plugin description"
               *   },
               *   "zh": {
               *     "title": "插件标题",
               *     "description": "插件描述"
               *   }
               * }
               */
              i18n?: Record<string, never>;
              secret: string;
              /** @enum {string} */
              status: "developing" | "reviewing" | "published";
              pluginUser?: {
                id: string;
                name: string;
                /** Format: email */
                email: string;
                avatar?: string;
              };
              createdTime: string;
              lastModifiedTime: string;
            };
          };
        };
      };
    };
    /** @description Delete a plugin */
    delete: {
      parameters: {
        path: {
          id: string;
        };
      };
      responses: {
        /** @description Returns no content. */
        200: {
          content: never;
        };
      };
    };
  };
  "/plugin/{id}/regenerate-secret": {
    /** @description Regenerate a plugin secret */
    post: {
      parameters: {
        path: {
          id: string;
        };
      };
      responses: {
        /** @description Returns data about the plugin. */
        201: {
          content: {
            "application/json": {
              id: string;
              secret: string;
            };
          };
        };
      };
    };
  };
  "/plugin/{pluginId}": {
    /** @description Get a plugin */
    get: {
      parameters: {
        path: {
          pluginId: string;
        };
      };
      responses: {
        /** @description Returns data about the plugin. */
        200: {
          content: {
            "application/json": {
              id: string;
              name: string;
              description?: string;
              detailDesc?: string;
              logo: string;
              url?: string;
              helpUrl?: string;
              positions: ("dashboard" | "view" | "contextMenu" | "panel")[];
              /**
               * @example {
               *   "en": {
               *     "title": "Plugin title",
               *     "description": "Plugin description"
               *   },
               *   "zh": {
               *     "title": "插件标题",
               *     "description": "插件描述"
               *   }
               * }
               */
              i18n?: Record<string, never>;
              config?: {
                contextMenu?: {
                  width?: number | string;
                  height?: number | string;
                  x?: number | string;
                  y?: number | string;
                  frozenResize?: boolean;
                  frozenDrag?: boolean;
                };
                view?: unknown;
                dashboard?: unknown;
                panel?: unknown;
              };
              secret: string;
              /** @enum {string} */
              status: "developing" | "reviewing" | "published";
              pluginUser?: {
                id: string;
                name: string;
                /** Format: email */
                email: string;
                avatar?: string;
              };
              createdTime: string;
              lastModifiedTime: string;
            };
          };
        };
      };
    };
  };
  "/plugin/center/list": {
    /** @description Get a list of plugins center */
    get: {
      parameters: {
        query?: {
          ids?: string[];
          positions?: string;
        };
      };
      responses: {
        /** @description Returns data about the plugin center list. */
        200: {
          content: {
            "application/json": ({
                id: string;
                name: string;
                description?: string;
                detailDesc?: string;
                logo: string;
                helpUrl?: string;
                /**
                 * @example {
                 *   "en": {
                 *     "title": "Plugin title",
                 *     "description": "Plugin description"
                 *   },
                 *   "zh": {
                 *     "title": "插件标题",
                 *     "description": "插件描述"
                 *   }
                 * }
                 */
                i18n?: Record<string, never>;
                url?: string;
                /** @enum {string} */
                status: "developing" | "reviewing" | "published";
                createdTime: string;
                lastModifiedTime?: string;
                createdBy: {
                  id: string;
                  name: string;
                  /** Format: email */
                  email: string;
                  avatar?: string;
                };
              })[];
          };
        };
      };
    };
  };
  "/plugin/{pluginId}/submit": {
    /** @description Submit a plugin */
    patch: {
      parameters: {
        path: {
          pluginId: string;
        };
      };
      responses: {
        /** @description Plugin submitted successfully. */
        200: {
          content: never;
        };
      };
    };
  };
  "/plugin/{pluginId}/token": {
    /** @description Get a token */
    get: {
      parameters: {
        path: {
          pluginId: string;
        };
      };
      requestBody?: {
        content: {
          "application/json": {
            baseId: string;
            secret: string;
            scopes: string[];
            authCode: string;
          };
        };
      };
      responses: {
        /** @description Returns token. */
        200: {
          content: {
            "application/json": {
              accessToken: string;
              refreshToken: string;
              scopes: string[];
              expiresIn: number;
              refreshExpiresIn: number;
            };
          };
        };
      };
    };
  };
  "/plugin/{pluginId}/refreshToken": {
    /** @description Refresh a token */
    post: {
      parameters: {
        path: {
          pluginId: string;
        };
      };
      requestBody?: {
        content: {
          "application/json": {
            refreshToken: string;
            secret: string;
          };
        };
      };
      responses: {
        /** @description Returns token. */
        201: {
          content: {
            "application/json": {
              accessToken: string;
              refreshToken: string;
              scopes: string[];
              expiresIn: number;
              refreshExpiresIn: number;
            };
          };
        };
      };
    };
  };
  "/plugin/{pluginId}/authCode": {
    /** @description Get an auth code */
    post: {
      parameters: {
        path: {
          pluginId: string;
        };
      };
      requestBody?: {
        content: {
          "application/json": {
            baseId: string;
          };
        };
      };
      responses: {
        /** @description Returns auth code. */
        201: {
          content: {
            "application/json": {
              code: string;
            };
          };
        };
      };
    };
  };
  "/plugin/{pluginId}/unpublish": {
    patch: {
      parameters: {
        path: {
          pluginId: string;
        };
      };
      responses: {
        /** @description Plugin unpublished successfully. */
        200: {
          content: never;
        };
      };
    };
  };
  "/plugin/chart/{pluginInstallId}/dashboard/{positionId}/query": {
    /** @description Get a dashboard install plugin query by id */
    get: {
      parameters: {
        query: {
          baseId: string;
          cellFormat?: "json" | "text";
        };
        path: {
          pluginInstallId: string;
          positionId: string;
        };
      };
      responses: {
        /** @description Returns data about the dashboard install plugin query. */
        200: {
          content: {
            "application/json": {
              rows: {
                  [key: string]: unknown;
                }[];
              columns: ({
                  name: string;
                  column: string;
                  /** @enum {string} */
                  type: "aggregation" | "field";
                  fieldSource?: {
                    /** @description The id of the field. */
                    id: string;
                    /**
                     * @description The name of the field. can not be duplicated in the table.
                     * @example Tags
                     */
                    name: string;
                    /**
                     * @description The field types supported by teable.
                     * @example singleSelect
                     * @enum {string}
                     */
                    type: "singleLineText" | "longText" | "user" | "attachment" | "checkbox" | "multipleSelect" | "singleSelect" | "date" | "number" | "rating" | "formula" | "rollup" | "link" | "createdTime" | "lastModifiedTime" | "createdBy" | "lastModifiedBy" | "autoNumber" | "button" | "department" | "createdByDepartment" | "lastModifiedByDepartment";
                    /**
                     * @description The description of the field.
                     * @example this is a summary
                     */
                    description?: string;
                    /** @description The configuration options of the field. The structure of the field's options depend on the field's type. */
                    options: ({
                      /** @enum {string} */
                      expression: "countall({values})" | "counta({values})" | "count({values})" | "sum({values})" | "max({values})" | "min({values})" | "and({values})" | "or({values})" | "xor({values})" | "array_join({values})" | "array_unique({values})" | "array_compact({values})" | "concatenate({values})";
                      /** @description The time zone that should be used to format dates */
                      timeZone?: string;
                      /** @description Different cell value types are determined based on the results of expression parsing, where numbers, dates, and formatting options are provided */
                      formatting?: ({
                        /** @description the display formatting of the date. you can use the following presets: M/D/YYYY, D/M/YYYY, YYYY/MM/DD, YYYY-MM-DD, YYYY-MM, MM-DD, YYYY, MM, DD */
                        date: string;
                        /**
                         * @description the display formatting of the time. you can use the following presets: HH:mm, hh:mm A, None
                         * @enum {string}
                         */
                        time: "HH:mm" | "hh:mm A" | "None";
                        /** @description The time zone that should be used to format dates */
                        timeZone: string;
                      }) | {
                        precision: number;
                        /** @enum {string} */
                        type: "decimal";
                      } | {
                        precision: number;
                        /** @enum {string} */
                        type: "percent";
                      } | {
                        precision: number;
                        /** @enum {string} */
                        type: "currency";
                        symbol: string;
                      };
                      /** @description According to the results of expression parsing to determine different visual effects, where strings, numbers will provide customized "show as" */
                      showAs?: ({
                        /**
                         * @description can display as url, email or phone in string field with a button to perform the corresponding action, start a phone call, send an email, or open a link in a new tab
                         * @enum {string}
                         */
                        type: "url" | "email" | "phone";
                      }) | ({
                        /**
                         * @description can display as bar or ring in number field with single cellValue value
                         * @enum {string}
                         */
                        type: "bar" | "ring";
                        /** @enum {string} */
                        color: "blueLight2" | "blueLight1" | "blueBright" | "blue" | "blueDark1" | "cyanLight2" | "cyanLight1" | "cyanBright" | "cyan" | "cyanDark1" | "grayLight2" | "grayLight1" | "grayBright" | "gray" | "grayDark1" | "greenLight2" | "greenLight1" | "greenBright" | "green" | "greenDark1" | "orangeLight2" | "orangeLight1" | "orangeBright" | "orange" | "orangeDark1" | "pinkLight2" | "pinkLight1" | "pinkBright" | "pink" | "pinkDark1" | "purpleLight2" | "purpleLight1" | "purpleBright" | "purple" | "purpleDark1" | "redLight2" | "redLight1" | "redBright" | "red" | "redDark1" | "tealLight2" | "tealLight1" | "tealBright" | "teal" | "tealDark1" | "yellowLight2" | "yellowLight1" | "yellowBright" | "yellow" | "yellowDark1";
                        /** @description whether to displays the specific value on the graph */
                        showValue: boolean;
                        /** @description the value that represents a 100% maximum value, it does not represent a hard limit on the value */
                        maxValue: number;
                      }) | ({
                        /**
                         * @description can display as bar or line in number field with multiple cellValue value
                         * @enum {string}
                         */
                        type: "bar" | "line";
                        /** @enum {string} */
                        color: "blueLight2" | "blueLight1" | "blueBright" | "blue" | "blueDark1" | "cyanLight2" | "cyanLight1" | "cyanBright" | "cyan" | "cyanDark1" | "grayLight2" | "grayLight1" | "grayBright" | "gray" | "grayDark1" | "greenLight2" | "greenLight1" | "greenBright" | "green" | "greenDark1" | "orangeLight2" | "orangeLight1" | "orangeBright" | "orange" | "orangeDark1" | "pinkLight2" | "pinkLight1" | "pinkBright" | "pink" | "pinkDark1" | "purpleLight2" | "purpleLight1" | "purpleBright" | "purple" | "purpleDark1" | "redLight2" | "redLight1" | "redBright" | "red" | "redDark1" | "tealLight2" | "tealLight1" | "tealBright" | "teal" | "tealDark1" | "yellowLight2" | "yellowLight1" | "yellowBright" | "yellow" | "yellowDark1";
                      });
                    }) | ({
                      /** @description The formula including fields referenced by their IDs. For example, LEFT(4, {Birthday}) input will be returned as LEFT(4, {fldXXX}) via API. The formula syntax in Teable is basically the same as Airtable */
                      expression: string;
                      /** @description The time zone that should be used to format dates */
                      timeZone?: string;
                      /** @description Different cell value types are determined based on the results of expression parsing, where numbers, dates, and formatting options are provided */
                      formatting?: ({
                        /** @description the display formatting of the date. you can use the following presets: M/D/YYYY, D/M/YYYY, YYYY/MM/DD, YYYY-MM-DD, YYYY-MM, MM-DD, YYYY, MM, DD */
                        date: string;
                        /**
                         * @description the display formatting of the time. you can use the following presets: HH:mm, hh:mm A, None
                         * @enum {string}
                         */
                        time: "HH:mm" | "hh:mm A" | "None";
                        /** @description The time zone that should be used to format dates */
                        timeZone: string;
                      }) | {
                        precision: number;
                        /** @enum {string} */
                        type: "decimal";
                      } | {
                        precision: number;
                        /** @enum {string} */
                        type: "percent";
                      } | {
                        precision: number;
                        /** @enum {string} */
                        type: "currency";
                        symbol: string;
                      };
                      /** @description According to the results of expression parsing to determine different visual effects, where strings, numbers will provide customized "show as" */
                      showAs?: ({
                        /**
                         * @description can display as url, email or phone in string field with a button to perform the corresponding action, start a phone call, send an email, or open a link in a new tab
                         * @enum {string}
                         */
                        type: "url" | "email" | "phone";
                      }) | ({
                        /**
                         * @description can display as bar or ring in number field with single cellValue value
                         * @enum {string}
                         */
                        type: "bar" | "ring";
                        /** @enum {string} */
                        color: "blueLight2" | "blueLight1" | "blueBright" | "blue" | "blueDark1" | "cyanLight2" | "cyanLight1" | "cyanBright" | "cyan" | "cyanDark1" | "grayLight2" | "grayLight1" | "grayBright" | "gray" | "grayDark1" | "greenLight2" | "greenLight1" | "greenBright" | "green" | "greenDark1" | "orangeLight2" | "orangeLight1" | "orangeBright" | "orange" | "orangeDark1" | "pinkLight2" | "pinkLight1" | "pinkBright" | "pink" | "pinkDark1" | "purpleLight2" | "purpleLight1" | "purpleBright" | "purple" | "purpleDark1" | "redLight2" | "redLight1" | "redBright" | "red" | "redDark1" | "tealLight2" | "tealLight1" | "tealBright" | "teal" | "tealDark1" | "yellowLight2" | "yellowLight1" | "yellowBright" | "yellow" | "yellowDark1";
                        /** @description whether to displays the specific value on the graph */
                        showValue: boolean;
                        /** @description the value that represents a 100% maximum value, it does not represent a hard limit on the value */
                        maxValue: number;
                      }) | ({
                        /**
                         * @description can display as bar or line in number field with multiple cellValue value
                         * @enum {string}
                         */
                        type: "bar" | "line";
                        /** @enum {string} */
                        color: "blueLight2" | "blueLight1" | "blueBright" | "blue" | "blueDark1" | "cyanLight2" | "cyanLight1" | "cyanBright" | "cyan" | "cyanDark1" | "grayLight2" | "grayLight1" | "grayBright" | "gray" | "grayDark1" | "greenLight2" | "greenLight1" | "greenBright" | "green" | "greenDark1" | "orangeLight2" | "orangeLight1" | "orangeBright" | "orange" | "orangeDark1" | "pinkLight2" | "pinkLight1" | "pinkBright" | "pink" | "pinkDark1" | "purpleLight2" | "purpleLight1" | "purpleBright" | "purple" | "purpleDark1" | "redLight2" | "redLight1" | "redBright" | "red" | "redDark1" | "tealLight2" | "tealLight1" | "tealBright" | "teal" | "tealDark1" | "yellowLight2" | "yellowLight1" | "yellowBright" | "yellow" | "yellowDark1";
                      });
                    }) | ({
                      /** @description the base id of the table that this field is linked to, only required for cross base link */
                      baseId?: string;
                      /**
                       * @description describe the relationship from this table to the foreign table
                       * @enum {string}
                       */
                      relationship: "oneOne" | "manyMany" | "oneMany" | "manyOne";
                      /** @description the table this field is linked to */
                      foreignTableId: string;
                      /** @description the field in the foreign table that will be displayed as the current field */
                      lookupFieldId: string;
                      /** @description whether the field is a one-way link, when true, it will not generate a symmetric field, it is generally has better performance */
                      isOneWay?: boolean;
                      /** @description the table name for storing keys, in many-to-many relationships, keys are stored in a separate intermediate table; in other relationships, keys are stored on one side as needed */
                      fkHostTableName: string;
                      /** @description the name of the field that stores the current table primary key */
                      selfKeyName: string;
                      /** @description The name of the field that stores the foreign table primary key */
                      foreignKeyName: string;
                      /** @description the symmetric field in the foreign table, empty if the field is a one-way link */
                      symmetricFieldId?: string;
                      /** @description the view id that limits the number of records in the link field */
                      filterByViewId?: string | null;
                      /** @description the fields that will be displayed in the link field */
                      visibleFieldIds?: string[] | null;
                      /** @description A filter object for complex query conditions based on fields, operators, and values. Use our visual query builder at https://app.teable.ai/developer/tool/query-builder to build filters. */
                      filter?: Record<string, never>;
                    }) | ({
                      /** @description caveat: the formatting is just a formatter, it dose not effect the storing value of the record */
                      formatting: {
                        /** @description the display formatting of the date. you can use the following presets: M/D/YYYY, D/M/YYYY, YYYY/MM/DD, YYYY-MM-DD, YYYY-MM, MM-DD, YYYY, MM, DD */
                        date: string;
                        /**
                         * @description the display formatting of the time. you can use the following presets: HH:mm, hh:mm A, None
                         * @enum {string}
                         */
                        time: "HH:mm" | "hh:mm A" | "None";
                        /** @description The time zone that should be used to format dates */
                        timeZone: string;
                      };
                      /**
                       * @description Whether the new row is automatically filled with the current time, caveat: the defaultValue is just a flag, it dose not effect the storing value of the record
                       * @enum {string}
                       */
                      defaultValue?: "now";
                    }) | {
                      defaultValue?: boolean;
                    } | Record<string, never> | ({
                      /** @description Only be used in single line text field or formula / rollup field with cellValueType equals String and isMultipleCellValue is not true */
                      showAs?: {
                        /**
                         * @description can display as url, email or phone in string field with a button to perform the corresponding action, start a phone call, send an email, or open a link in a new tab
                         * @enum {string}
                         */
                        type: "url" | "email" | "phone";
                      };
                      defaultValue?: string;
                    }) | ({
                      /** @enum {string} */
                      icon: "star" | "moon" | "sun" | "zap" | "flame" | "heart" | "apple" | "thumb-up";
                      /** @enum {string} */
                      color: "yellowBright" | "redBright" | "tealBright";
                      max: number;
                    }) | ({
                      /** @description Allow adding multiple users */
                      isMultiple?: boolean;
                      /** @description Notify users when their name is added to a cell */
                      shouldNotify?: boolean;
                      defaultValue?: string | "me" | ((string | "me")[]);
                    }) | ({
                      /** @description Button label */
                      label: string;
                      /**
                       * @description Button color
                       * @enum {string}
                       */
                      color: "blueLight2" | "blueLight1" | "blueBright" | "blue" | "blueDark1" | "cyanLight2" | "cyanLight1" | "cyanBright" | "cyan" | "cyanDark1" | "grayLight2" | "grayLight1" | "grayBright" | "gray" | "grayDark1" | "greenLight2" | "greenLight1" | "greenBright" | "green" | "greenDark1" | "orangeLight2" | "orangeLight1" | "orangeBright" | "orange" | "orangeDark1" | "pinkLight2" | "pinkLight1" | "pinkBright" | "pink" | "pinkDark1" | "purpleLight2" | "purpleLight1" | "purpleBright" | "purple" | "purpleDark1" | "redLight2" | "redLight1" | "redBright" | "red" | "redDark1" | "tealLight2" | "tealLight1" | "tealBright" | "teal" | "tealDark1" | "yellowLight2" | "yellowLight1" | "yellowBright" | "yellow" | "yellowDark1";
                      /** @description Max count of button clicks */
                      maxCount?: number;
                      /** @description Reset count */
                      resetCount?: boolean;
                      /** @description Workflow */
                      workflow?: {
                        /** @description Workflow ID */
                        id?: string;
                        /** @description Workflow Name */
                        name?: string;
                        /** @description Workflow is active */
                        isActive?: boolean;
                      } | null;
                    }) | ({
                      choices: ({
                          id: string;
                          name: string;
                          /** @enum {string} */
                          color: "blueLight2" | "blueLight1" | "blueBright" | "blue" | "blueDark1" | "cyanLight2" | "cyanLight1" | "cyanBright" | "cyan" | "cyanDark1" | "grayLight2" | "grayLight1" | "grayBright" | "gray" | "grayDark1" | "greenLight2" | "greenLight1" | "greenBright" | "green" | "greenDark1" | "orangeLight2" | "orangeLight1" | "orangeBright" | "orange" | "orangeDark1" | "pinkLight2" | "pinkLight1" | "pinkBright" | "pink" | "pinkDark1" | "purpleLight2" | "purpleLight1" | "purpleBright" | "purple" | "purpleDark1" | "redLight2" | "redLight1" | "redBright" | "red" | "redDark1" | "tealLight2" | "tealLight1" | "tealBright" | "teal" | "tealDark1" | "yellowLight2" | "yellowLight1" | "yellowBright" | "yellow" | "yellowDark1";
                        })[];
                      defaultValue?: string | string[];
                      preventAutoNewOptions?: boolean;
                    }) | ({
                      /** @description Only be used in number field (number field or formula / rollup field with cellValueType equals Number */
                      formatting: {
                        precision: number;
                        /** @enum {string} */
                        type: "decimal";
                      } | {
                        precision: number;
                        /** @enum {string} */
                        type: "percent";
                      } | {
                        precision: number;
                        /** @enum {string} */
                        type: "currency";
                        symbol: string;
                      };
                      /** @description Only be used in number field (number field or formula / rollup field with cellValueType equals Number */
                      showAs?: ({
                        /**
                         * @description can display as bar or ring in number field with single cellValue value
                         * @enum {string}
                         */
                        type: "bar" | "ring";
                        /** @enum {string} */
                        color: "blueLight2" | "blueLight1" | "blueBright" | "blue" | "blueDark1" | "cyanLight2" | "cyanLight1" | "cyanBright" | "cyan" | "cyanDark1" | "grayLight2" | "grayLight1" | "grayBright" | "gray" | "grayDark1" | "greenLight2" | "greenLight1" | "greenBright" | "green" | "greenDark1" | "orangeLight2" | "orangeLight1" | "orangeBright" | "orange" | "orangeDark1" | "pinkLight2" | "pinkLight1" | "pinkBright" | "pink" | "pinkDark1" | "purpleLight2" | "purpleLight1" | "purpleBright" | "purple" | "purpleDark1" | "redLight2" | "redLight1" | "redBright" | "red" | "redDark1" | "tealLight2" | "tealLight1" | "tealBright" | "teal" | "tealDark1" | "yellowLight2" | "yellowLight1" | "yellowBright" | "yellow" | "yellowDark1";
                        /** @description whether to displays the specific value on the graph */
                        showValue: boolean;
                        /** @description the value that represents a 100% maximum value, it does not represent a hard limit on the value */
                        maxValue: number;
                      }) | ({
                        /**
                         * @description can display as bar or line in number field with multiple cellValue value
                         * @enum {string}
                         */
                        type: "bar" | "line";
                        /** @enum {string} */
                        color: "blueLight2" | "blueLight1" | "blueBright" | "blue" | "blueDark1" | "cyanLight2" | "cyanLight1" | "cyanBright" | "cyan" | "cyanDark1" | "grayLight2" | "grayLight1" | "grayBright" | "gray" | "grayDark1" | "greenLight2" | "greenLight1" | "greenBright" | "green" | "greenDark1" | "orangeLight2" | "orangeLight1" | "orangeBright" | "orange" | "orangeDark1" | "pinkLight2" | "pinkLight1" | "pinkBright" | "pink" | "pinkDark1" | "purpleLight2" | "purpleLight1" | "purpleBright" | "purple" | "purpleDark1" | "redLight2" | "redLight1" | "redBright" | "red" | "redDark1" | "tealLight2" | "tealLight1" | "tealBright" | "teal" | "tealDark1" | "yellowLight2" | "yellowLight1" | "yellowBright" | "yellow" | "yellowDark1";
                      });
                      defaultValue?: number;
                    }) | {
                      /** @enum {string} */
                      expression: "AUTO_NUMBER()";
                    } | ({
                      /** @enum {string} */
                      expression: "CREATED_TIME()";
                      /** @description caveat: the formatting is just a formatter, it dose not effect the storing value of the record */
                      formatting: {
                        /** @description the display formatting of the date. you can use the following presets: M/D/YYYY, D/M/YYYY, YYYY/MM/DD, YYYY-MM-DD, YYYY-MM, MM-DD, YYYY, MM, DD */
                        date: string;
                        /**
                         * @description the display formatting of the time. you can use the following presets: HH:mm, hh:mm A, None
                         * @enum {string}
                         */
                        time: "HH:mm" | "hh:mm A" | "None";
                        /** @description The time zone that should be used to format dates */
                        timeZone: string;
                      };
                    }) | ({
                      /** @enum {string} */
                      expression: "LAST_MODIFIED_TIME()";
                      /** @description caveat: the formatting is just a formatter, it dose not effect the storing value of the record */
                      formatting: {
                        /** @description the display formatting of the date. you can use the following presets: M/D/YYYY, D/M/YYYY, YYYY/MM/DD, YYYY-MM-DD, YYYY-MM, MM-DD, YYYY, MM, DD */
                        date: string;
                        /**
                         * @description the display formatting of the time. you can use the following presets: HH:mm, hh:mm A, None
                         * @enum {string}
                         */
                        time: "HH:mm" | "hh:mm A" | "None";
                        /** @description The time zone that should be used to format dates */
                        timeZone: string;
                      };
                    });
                    /** @description The AI configuration of the field. */
                    aiConfig?: unknown;
                    /** @description Whether this field is lookup field. witch means cellValue and [fieldType] is looked up from the linked table. */
                    isLookup?: boolean;
                    /** @description field lookup options. */
                    lookupOptions?: {
                      /** @description the table this field is linked to */
                      foreignTableId: string;
                      /** @description the field in the foreign table that will be displayed as the current field */
                      lookupFieldId: string;
                      /**
                       * @description describe the relationship from this table to the foreign table
                       * @enum {string}
                       */
                      relationship: "oneOne" | "manyMany" | "oneMany" | "manyOne";
                      /** @description the table name for storing keys, in many-to-many relationships, keys are stored in a separate intermediate table; in other relationships, keys are stored on one side as needed */
                      fkHostTableName: string;
                      /** @description the name of the field that stores the current table primary key */
                      selfKeyName: string;
                      /** @description The name of the field that stores the foreign table primary key */
                      foreignKeyName: string;
                      /** @description A filter object for complex query conditions based on fields, operators, and values. Use our visual query builder at https://app.teable.ai/developer/tool/query-builder to build filters. */
                      filter?: Record<string, never>;
                      /** @description The id of Linked record field to use for lookup */
                      linkFieldId: string;
                    };
                    /** @description Whether this field is not null. */
                    notNull?: boolean;
                    /** @description Whether this field is not unique. */
                    unique?: boolean;
                    /** @description Whether this field is primary field. */
                    isPrimary?: boolean;
                    /** @description Whether this field is computed field, you can not modify cellValue in computed field. */
                    isComputed?: boolean;
                    /** @description Whether this field's calculation is pending. */
                    isPending?: boolean;
                    /** @description Whether This field has a configuration error. Check the fields referenced by this field's formula or configuration. */
                    hasError?: boolean;
                    /**
                     * @description The cell value type of the field.
                     * @enum {string}
                     */
                    cellValueType: "string" | "number" | "boolean" | "dateTime";
                    /** @description Whether this field has multiple cell value. */
                    isMultipleCellValue?: boolean;
                    /**
                     * @description The field type of database that cellValue really store.
                     * @enum {string}
                     */
                    dbFieldType: "TEXT" | "INTEGER" | "DATETIME" | "REAL" | "BLOB" | "JSON" | "BOOLEAN";
                    /** @description Field(column) name in backend database. Limitation: 1-63 characters, can only contain letters, numbers and underscore, case sensitive, cannot be duplicated with existing db field name in the table. */
                    dbFieldName: string;
                    /** @description Field record read permission. When set to false, reading records is denied. When true or not set, reading records is allowed. */
                    recordRead?: boolean;
                    /** @description Field record create permission. When set to false, creating records is denied. When true or not set, creating records is allowed. */
                    recordCreate?: boolean;
                  };
                })[];
            };
          };
        };
      };
    };
  };
  "/plugin/chart/{pluginInstallId}/plugin-panel/{positionId}/query": {
    /** @description Get a plugin panel install plugin query by id */
    get: {
      parameters: {
        query: {
          tableId: string;
          cellFormat?: "json" | "text";
        };
        path: {
          pluginInstallId: string;
          positionId: string;
        };
      };
      responses: {
        /** @description Returns data about the plugin panel install plugin query. */
        200: {
          content: {
            "application/json": {
              rows: {
                  [key: string]: unknown;
                }[];
              columns: ({
                  name: string;
                  column: string;
                  /** @enum {string} */
                  type: "aggregation" | "field";
                  fieldSource?: {
                    /** @description The id of the field. */
                    id: string;
                    /**
                     * @description The name of the field. can not be duplicated in the table.
                     * @example Tags
                     */
                    name: string;
                    /**
                     * @description The field types supported by teable.
                     * @example singleSelect
                     * @enum {string}
                     */
                    type: "singleLineText" | "longText" | "user" | "attachment" | "checkbox" | "multipleSelect" | "singleSelect" | "date" | "number" | "rating" | "formula" | "rollup" | "link" | "createdTime" | "lastModifiedTime" | "createdBy" | "lastModifiedBy" | "autoNumber" | "button" | "department" | "createdByDepartment" | "lastModifiedByDepartment";
                    /**
                     * @description The description of the field.
                     * @example this is a summary
                     */
                    description?: string;
                    /** @description The configuration options of the field. The structure of the field's options depend on the field's type. */
                    options: ({
                      /** @enum {string} */
                      expression: "countall({values})" | "counta({values})" | "count({values})" | "sum({values})" | "max({values})" | "min({values})" | "and({values})" | "or({values})" | "xor({values})" | "array_join({values})" | "array_unique({values})" | "array_compact({values})" | "concatenate({values})";
                      /** @description The time zone that should be used to format dates */
                      timeZone?: string;
                      /** @description Different cell value types are determined based on the results of expression parsing, where numbers, dates, and formatting options are provided */
                      formatting?: ({
                        /** @description the display formatting of the date. you can use the following presets: M/D/YYYY, D/M/YYYY, YYYY/MM/DD, YYYY-MM-DD, YYYY-MM, MM-DD, YYYY, MM, DD */
                        date: string;
                        /**
                         * @description the display formatting of the time. you can use the following presets: HH:mm, hh:mm A, None
                         * @enum {string}
                         */
                        time: "HH:mm" | "hh:mm A" | "None";
                        /** @description The time zone that should be used to format dates */
                        timeZone: string;
                      }) | {
                        precision: number;
                        /** @enum {string} */
                        type: "decimal";
                      } | {
                        precision: number;
                        /** @enum {string} */
                        type: "percent";
                      } | {
                        precision: number;
                        /** @enum {string} */
                        type: "currency";
                        symbol: string;
                      };
                      /** @description According to the results of expression parsing to determine different visual effects, where strings, numbers will provide customized "show as" */
                      showAs?: ({
                        /**
                         * @description can display as url, email or phone in string field with a button to perform the corresponding action, start a phone call, send an email, or open a link in a new tab
                         * @enum {string}
                         */
                        type: "url" | "email" | "phone";
                      }) | ({
                        /**
                         * @description can display as bar or ring in number field with single cellValue value
                         * @enum {string}
                         */
                        type: "bar" | "ring";
                        /** @enum {string} */
                        color: "blueLight2" | "blueLight1" | "blueBright" | "blue" | "blueDark1" | "cyanLight2" | "cyanLight1" | "cyanBright" | "cyan" | "cyanDark1" | "grayLight2" | "grayLight1" | "grayBright" | "gray" | "grayDark1" | "greenLight2" | "greenLight1" | "greenBright" | "green" | "greenDark1" | "orangeLight2" | "orangeLight1" | "orangeBright" | "orange" | "orangeDark1" | "pinkLight2" | "pinkLight1" | "pinkBright" | "pink" | "pinkDark1" | "purpleLight2" | "purpleLight1" | "purpleBright" | "purple" | "purpleDark1" | "redLight2" | "redLight1" | "redBright" | "red" | "redDark1" | "tealLight2" | "tealLight1" | "tealBright" | "teal" | "tealDark1" | "yellowLight2" | "yellowLight1" | "yellowBright" | "yellow" | "yellowDark1";
                        /** @description whether to displays the specific value on the graph */
                        showValue: boolean;
                        /** @description the value that represents a 100% maximum value, it does not represent a hard limit on the value */
                        maxValue: number;
                      }) | ({
                        /**
                         * @description can display as bar or line in number field with multiple cellValue value
                         * @enum {string}
                         */
                        type: "bar" | "line";
                        /** @enum {string} */
                        color: "blueLight2" | "blueLight1" | "blueBright" | "blue" | "blueDark1" | "cyanLight2" | "cyanLight1" | "cyanBright" | "cyan" | "cyanDark1" | "grayLight2" | "grayLight1" | "grayBright" | "gray" | "grayDark1" | "greenLight2" | "greenLight1" | "greenBright" | "green" | "greenDark1" | "orangeLight2" | "orangeLight1" | "orangeBright" | "orange" | "orangeDark1" | "pinkLight2" | "pinkLight1" | "pinkBright" | "pink" | "pinkDark1" | "purpleLight2" | "purpleLight1" | "purpleBright" | "purple" | "purpleDark1" | "redLight2" | "redLight1" | "redBright" | "red" | "redDark1" | "tealLight2" | "tealLight1" | "tealBright" | "teal" | "tealDark1" | "yellowLight2" | "yellowLight1" | "yellowBright" | "yellow" | "yellowDark1";
                      });
                    }) | ({
                      /** @description The formula including fields referenced by their IDs. For example, LEFT(4, {Birthday}) input will be returned as LEFT(4, {fldXXX}) via API. The formula syntax in Teable is basically the same as Airtable */
                      expression: string;
                      /** @description The time zone that should be used to format dates */
                      timeZone?: string;
                      /** @description Different cell value types are determined based on the results of expression parsing, where numbers, dates, and formatting options are provided */
                      formatting?: ({
                        /** @description the display formatting of the date. you can use the following presets: M/D/YYYY, D/M/YYYY, YYYY/MM/DD, YYYY-MM-DD, YYYY-MM, MM-DD, YYYY, MM, DD */
                        date: string;
                        /**
                         * @description the display formatting of the time. you can use the following presets: HH:mm, hh:mm A, None
                         * @enum {string}
                         */
                        time: "HH:mm" | "hh:mm A" | "None";
                        /** @description The time zone that should be used to format dates */
                        timeZone: string;
                      }) | {
                        precision: number;
                        /** @enum {string} */
                        type: "decimal";
                      } | {
                        precision: number;
                        /** @enum {string} */
                        type: "percent";
                      } | {
                        precision: number;
                        /** @enum {string} */
                        type: "currency";
                        symbol: string;
                      };
                      /** @description According to the results of expression parsing to determine different visual effects, where strings, numbers will provide customized "show as" */
                      showAs?: ({
                        /**
                         * @description can display as url, email or phone in string field with a button to perform the corresponding action, start a phone call, send an email, or open a link in a new tab
                         * @enum {string}
                         */
                        type: "url" | "email" | "phone";
                      }) | ({
                        /**
                         * @description can display as bar or ring in number field with single cellValue value
                         * @enum {string}
                         */
                        type: "bar" | "ring";
                        /** @enum {string} */
                        color: "blueLight2" | "blueLight1" | "blueBright" | "blue" | "blueDark1" | "cyanLight2" | "cyanLight1" | "cyanBright" | "cyan" | "cyanDark1" | "grayLight2" | "grayLight1" | "grayBright" | "gray" | "grayDark1" | "greenLight2" | "greenLight1" | "greenBright" | "green" | "greenDark1" | "orangeLight2" | "orangeLight1" | "orangeBright" | "orange" | "orangeDark1" | "pinkLight2" | "pinkLight1" | "pinkBright" | "pink" | "pinkDark1" | "purpleLight2" | "purpleLight1" | "purpleBright" | "purple" | "purpleDark1" | "redLight2" | "redLight1" | "redBright" | "red" | "redDark1" | "tealLight2" | "tealLight1" | "tealBright" | "teal" | "tealDark1" | "yellowLight2" | "yellowLight1" | "yellowBright" | "yellow" | "yellowDark1";
                        /** @description whether to displays the specific value on the graph */
                        showValue: boolean;
                        /** @description the value that represents a 100% maximum value, it does not represent a hard limit on the value */
                        maxValue: number;
                      }) | ({
                        /**
                         * @description can display as bar or line in number field with multiple cellValue value
                         * @enum {string}
                         */
                        type: "bar" | "line";
                        /** @enum {string} */
                        color: "blueLight2" | "blueLight1" | "blueBright" | "blue" | "blueDark1" | "cyanLight2" | "cyanLight1" | "cyanBright" | "cyan" | "cyanDark1" | "grayLight2" | "grayLight1" | "grayBright" | "gray" | "grayDark1" | "greenLight2" | "greenLight1" | "greenBright" | "green" | "greenDark1" | "orangeLight2" | "orangeLight1" | "orangeBright" | "orange" | "orangeDark1" | "pinkLight2" | "pinkLight1" | "pinkBright" | "pink" | "pinkDark1" | "purpleLight2" | "purpleLight1" | "purpleBright" | "purple" | "purpleDark1" | "redLight2" | "redLight1" | "redBright" | "red" | "redDark1" | "tealLight2" | "tealLight1" | "tealBright" | "teal" | "tealDark1" | "yellowLight2" | "yellowLight1" | "yellowBright" | "yellow" | "yellowDark1";
                      });
                    }) | ({
                      /** @description the base id of the table that this field is linked to, only required for cross base link */
                      baseId?: string;
                      /**
                       * @description describe the relationship from this table to the foreign table
                       * @enum {string}
                       */
                      relationship: "oneOne" | "manyMany" | "oneMany" | "manyOne";
                      /** @description the table this field is linked to */
                      foreignTableId: string;
                      /** @description the field in the foreign table that will be displayed as the current field */
                      lookupFieldId: string;
                      /** @description whether the field is a one-way link, when true, it will not generate a symmetric field, it is generally has better performance */
                      isOneWay?: boolean;
                      /** @description the table name for storing keys, in many-to-many relationships, keys are stored in a separate intermediate table; in other relationships, keys are stored on one side as needed */
                      fkHostTableName: string;
                      /** @description the name of the field that stores the current table primary key */
                      selfKeyName: string;
                      /** @description The name of the field that stores the foreign table primary key */
                      foreignKeyName: string;
                      /** @description the symmetric field in the foreign table, empty if the field is a one-way link */
                      symmetricFieldId?: string;
                      /** @description the view id that limits the number of records in the link field */
                      filterByViewId?: string | null;
                      /** @description the fields that will be displayed in the link field */
                      visibleFieldIds?: string[] | null;
                      /** @description A filter object for complex query conditions based on fields, operators, and values. Use our visual query builder at https://app.teable.ai/developer/tool/query-builder to build filters. */
                      filter?: Record<string, never>;
                    }) | ({
                      /** @description caveat: the formatting is just a formatter, it dose not effect the storing value of the record */
                      formatting: {
                        /** @description the display formatting of the date. you can use the following presets: M/D/YYYY, D/M/YYYY, YYYY/MM/DD, YYYY-MM-DD, YYYY-MM, MM-DD, YYYY, MM, DD */
                        date: string;
                        /**
                         * @description the display formatting of the time. you can use the following presets: HH:mm, hh:mm A, None
                         * @enum {string}
                         */
                        time: "HH:mm" | "hh:mm A" | "None";
                        /** @description The time zone that should be used to format dates */
                        timeZone: string;
                      };
                      /**
                       * @description Whether the new row is automatically filled with the current time, caveat: the defaultValue is just a flag, it dose not effect the storing value of the record
                       * @enum {string}
                       */
                      defaultValue?: "now";
                    }) | {
                      defaultValue?: boolean;
                    } | Record<string, never> | ({
                      /** @description Only be used in single line text field or formula / rollup field with cellValueType equals String and isMultipleCellValue is not true */
                      showAs?: {
                        /**
                         * @description can display as url, email or phone in string field with a button to perform the corresponding action, start a phone call, send an email, or open a link in a new tab
                         * @enum {string}
                         */
                        type: "url" | "email" | "phone";
                      };
                      defaultValue?: string;
                    }) | ({
                      /** @enum {string} */
                      icon: "star" | "moon" | "sun" | "zap" | "flame" | "heart" | "apple" | "thumb-up";
                      /** @enum {string} */
                      color: "yellowBright" | "redBright" | "tealBright";
                      max: number;
                    }) | ({
                      /** @description Allow adding multiple users */
                      isMultiple?: boolean;
                      /** @description Notify users when their name is added to a cell */
                      shouldNotify?: boolean;
                      defaultValue?: string | "me" | ((string | "me")[]);
                    }) | ({
                      /** @description Button label */
                      label: string;
                      /**
                       * @description Button color
                       * @enum {string}
                       */
                      color: "blueLight2" | "blueLight1" | "blueBright" | "blue" | "blueDark1" | "cyanLight2" | "cyanLight1" | "cyanBright" | "cyan" | "cyanDark1" | "grayLight2" | "grayLight1" | "grayBright" | "gray" | "grayDark1" | "greenLight2" | "greenLight1" | "greenBright" | "green" | "greenDark1" | "orangeLight2" | "orangeLight1" | "orangeBright" | "orange" | "orangeDark1" | "pinkLight2" | "pinkLight1" | "pinkBright" | "pink" | "pinkDark1" | "purpleLight2" | "purpleLight1" | "purpleBright" | "purple" | "purpleDark1" | "redLight2" | "redLight1" | "redBright" | "red" | "redDark1" | "tealLight2" | "tealLight1" | "tealBright" | "teal" | "tealDark1" | "yellowLight2" | "yellowLight1" | "yellowBright" | "yellow" | "yellowDark1";
                      /** @description Max count of button clicks */
                      maxCount?: number;
                      /** @description Reset count */
                      resetCount?: boolean;
                      /** @description Workflow */
                      workflow?: {
                        /** @description Workflow ID */
                        id?: string;
                        /** @description Workflow Name */
                        name?: string;
                        /** @description Workflow is active */
                        isActive?: boolean;
                      } | null;
                    }) | ({
                      choices: ({
                          id: string;
                          name: string;
                          /** @enum {string} */
                          color: "blueLight2" | "blueLight1" | "blueBright" | "blue" | "blueDark1" | "cyanLight2" | "cyanLight1" | "cyanBright" | "cyan" | "cyanDark1" | "grayLight2" | "grayLight1" | "grayBright" | "gray" | "grayDark1" | "greenLight2" | "greenLight1" | "greenBright" | "green" | "greenDark1" | "orangeLight2" | "orangeLight1" | "orangeBright" | "orange" | "orangeDark1" | "pinkLight2" | "pinkLight1" | "pinkBright" | "pink" | "pinkDark1" | "purpleLight2" | "purpleLight1" | "purpleBright" | "purple" | "purpleDark1" | "redLight2" | "redLight1" | "redBright" | "red" | "redDark1" | "tealLight2" | "tealLight1" | "tealBright" | "teal" | "tealDark1" | "yellowLight2" | "yellowLight1" | "yellowBright" | "yellow" | "yellowDark1";
                        })[];
                      defaultValue?: string | string[];
                      preventAutoNewOptions?: boolean;
                    }) | ({
                      /** @description Only be used in number field (number field or formula / rollup field with cellValueType equals Number */
                      formatting: {
                        precision: number;
                        /** @enum {string} */
                        type: "decimal";
                      } | {
                        precision: number;
                        /** @enum {string} */
                        type: "percent";
                      } | {
                        precision: number;
                        /** @enum {string} */
                        type: "currency";
                        symbol: string;
                      };
                      /** @description Only be used in number field (number field or formula / rollup field with cellValueType equals Number */
                      showAs?: ({
                        /**
                         * @description can display as bar or ring in number field with single cellValue value
                         * @enum {string}
                         */
                        type: "bar" | "ring";
                        /** @enum {string} */
                        color: "blueLight2" | "blueLight1" | "blueBright" | "blue" | "blueDark1" | "cyanLight2" | "cyanLight1" | "cyanBright" | "cyan" | "cyanDark1" | "grayLight2" | "grayLight1" | "grayBright" | "gray" | "grayDark1" | "greenLight2" | "greenLight1" | "greenBright" | "green" | "greenDark1" | "orangeLight2" | "orangeLight1" | "orangeBright" | "orange" | "orangeDark1" | "pinkLight2" | "pinkLight1" | "pinkBright" | "pink" | "pinkDark1" | "purpleLight2" | "purpleLight1" | "purpleBright" | "purple" | "purpleDark1" | "redLight2" | "redLight1" | "redBright" | "red" | "redDark1" | "tealLight2" | "tealLight1" | "tealBright" | "teal" | "tealDark1" | "yellowLight2" | "yellowLight1" | "yellowBright" | "yellow" | "yellowDark1";
                        /** @description whether to displays the specific value on the graph */
                        showValue: boolean;
                        /** @description the value that represents a 100% maximum value, it does not represent a hard limit on the value */
                        maxValue: number;
                      }) | ({
                        /**
                         * @description can display as bar or line in number field with multiple cellValue value
                         * @enum {string}
                         */
                        type: "bar" | "line";
                        /** @enum {string} */
                        color: "blueLight2" | "blueLight1" | "blueBright" | "blue" | "blueDark1" | "cyanLight2" | "cyanLight1" | "cyanBright" | "cyan" | "cyanDark1" | "grayLight2" | "grayLight1" | "grayBright" | "gray" | "grayDark1" | "greenLight2" | "greenLight1" | "greenBright" | "green" | "greenDark1" | "orangeLight2" | "orangeLight1" | "orangeBright" | "orange" | "orangeDark1" | "pinkLight2" | "pinkLight1" | "pinkBright" | "pink" | "pinkDark1" | "purpleLight2" | "purpleLight1" | "purpleBright" | "purple" | "purpleDark1" | "redLight2" | "redLight1" | "redBright" | "red" | "redDark1" | "tealLight2" | "tealLight1" | "tealBright" | "teal" | "tealDark1" | "yellowLight2" | "yellowLight1" | "yellowBright" | "yellow" | "yellowDark1";
                      });
                      defaultValue?: number;
                    }) | {
                      /** @enum {string} */
                      expression: "AUTO_NUMBER()";
                    } | ({
                      /** @enum {string} */
                      expression: "CREATED_TIME()";
                      /** @description caveat: the formatting is just a formatter, it dose not effect the storing value of the record */
                      formatting: {
                        /** @description the display formatting of the date. you can use the following presets: M/D/YYYY, D/M/YYYY, YYYY/MM/DD, YYYY-MM-DD, YYYY-MM, MM-DD, YYYY, MM, DD */
                        date: string;
                        /**
                         * @description the display formatting of the time. you can use the following presets: HH:mm, hh:mm A, None
                         * @enum {string}
                         */
                        time: "HH:mm" | "hh:mm A" | "None";
                        /** @description The time zone that should be used to format dates */
                        timeZone: string;
                      };
                    }) | ({
                      /** @enum {string} */
                      expression: "LAST_MODIFIED_TIME()";
                      /** @description caveat: the formatting is just a formatter, it dose not effect the storing value of the record */
                      formatting: {
                        /** @description the display formatting of the date. you can use the following presets: M/D/YYYY, D/M/YYYY, YYYY/MM/DD, YYYY-MM-DD, YYYY-MM, MM-DD, YYYY, MM, DD */
                        date: string;
                        /**
                         * @description the display formatting of the time. you can use the following presets: HH:mm, hh:mm A, None
                         * @enum {string}
                         */
                        time: "HH:mm" | "hh:mm A" | "None";
                        /** @description The time zone that should be used to format dates */
                        timeZone: string;
                      };
                    });
                    /** @description The AI configuration of the field. */
                    aiConfig?: unknown;
                    /** @description Whether this field is lookup field. witch means cellValue and [fieldType] is looked up from the linked table. */
                    isLookup?: boolean;
                    /** @description field lookup options. */
                    lookupOptions?: {
                      /** @description the table this field is linked to */
                      foreignTableId: string;
                      /** @description the field in the foreign table that will be displayed as the current field */
                      lookupFieldId: string;
                      /**
                       * @description describe the relationship from this table to the foreign table
                       * @enum {string}
                       */
                      relationship: "oneOne" | "manyMany" | "oneMany" | "manyOne";
                      /** @description the table name for storing keys, in many-to-many relationships, keys are stored in a separate intermediate table; in other relationships, keys are stored on one side as needed */
                      fkHostTableName: string;
                      /** @description the name of the field that stores the current table primary key */
                      selfKeyName: string;
                      /** @description The name of the field that stores the foreign table primary key */
                      foreignKeyName: string;
                      /** @description A filter object for complex query conditions based on fields, operators, and values. Use our visual query builder at https://app.teable.ai/developer/tool/query-builder to build filters. */
                      filter?: Record<string, never>;
                      /** @description The id of Linked record field to use for lookup */
                      linkFieldId: string;
                    };
                    /** @description Whether this field is not null. */
                    notNull?: boolean;
                    /** @description Whether this field is not unique. */
                    unique?: boolean;
                    /** @description Whether this field is primary field. */
                    isPrimary?: boolean;
                    /** @description Whether this field is computed field, you can not modify cellValue in computed field. */
                    isComputed?: boolean;
                    /** @description Whether this field's calculation is pending. */
                    isPending?: boolean;
                    /** @description Whether This field has a configuration error. Check the fields referenced by this field's formula or configuration. */
                    hasError?: boolean;
                    /**
                     * @description The cell value type of the field.
                     * @enum {string}
                     */
                    cellValueType: "string" | "number" | "boolean" | "dateTime";
                    /** @description Whether this field has multiple cell value. */
                    isMultipleCellValue?: boolean;
                    /**
                     * @description The field type of database that cellValue really store.
                     * @enum {string}
                     */
                    dbFieldType: "TEXT" | "INTEGER" | "DATETIME" | "REAL" | "BLOB" | "JSON" | "BOOLEAN";
                    /** @description Field(column) name in backend database. Limitation: 1-63 characters, can only contain letters, numbers and underscore, case sensitive, cannot be duplicated with existing db field name in the table. */
                    dbFieldName: string;
                    /** @description Field record read permission. When set to false, reading records is denied. When true or not set, reading records is allowed. */
                    recordRead?: boolean;
                    /** @description Field record create permission. When set to false, creating records is denied. When true or not set, creating records is allowed. */
                    recordCreate?: boolean;
                  };
                })[];
            };
          };
        };
      };
    };
  };
  "/base/{baseId}/export": {
    /** @description export a base by baseId */
    get: {
      parameters: {
        path: {
          baseId: string;
        };
      };
      responses: {
        /** @description export successfully */
        200: {
          content: never;
        };
      };
    };
  };
  "/attachments/notify/{token}": {
    /** @description Get Attachment information */
    post: {
      parameters: {
        query?: {
          filename?: string;
        };
        path: {
          token: string;
        };
      };
      responses: {
        /** @description Attachment information */
        201: {
          content: {
            "application/json": {
              /**
               * @description Token for the uploaded file
               * @example xxxxxxxxxxx
               */
              token: string;
              /**
               * @description File size in bytes
               * @example 1024
               */
              size: number;
              /**
               * @description URL of the uploaded file
               * @example /bucket/xxxxx
               */
              url: string;
              /**
               * @description file path
               * @example /table/xxxxxx
               */
              path: string;
              /**
               * @description MIME type of the uploaded file
               * @example video/mp4
               */
              mimetype: string;
              /**
               * @description Image width of the uploaded file
               * @example 100
               */
              width?: number;
              /**
               * @description Image height of the uploaded file
               * @example 100
               */
              height?: number;
              /** @description Preview url */
              presignedUrl: string;
            };
          };
        };
      };
    };
  };
  "/attachments/{token}": {
    /** @description Upload attachment */
    get: {
      parameters: {
        query?: {
          filename?: string;
        };
        path: {
          token: string;
        };
      };
      responses: {
        200: {
          content: never;
        };
      };
    };
  };
  "/attachments/signature": {
    /** @description Retrieve upload signature. */
    post: {
      requestBody?: {
        content: {
          "application/json": {
            /**
             * @description Mime type
             * @example image/png
             */
            contentType: string;
            /**
             * @description File size
             * @example 123
             */
            contentLength: number;
            /**
             * @description Token expire time, seconds
             * @example 3600
             */
            expiresIn?: number;
            /**
             * @description File hash
             * @example xxxxxxxx
             */
            hash?: string;
            /**
             * @description Type
             * @example 1
             * @enum {integer}
             */
            type: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14;
            baseId?: string;
          };
        };
      };
      responses: {
        /** @description return the upload URL and the key. */
        201: {
          content: {
            "application/json": {
              /**
               * @description Upload url
               * @example https://example.com/attachment/upload
               */
              url: string;
              /**
               * @description Upload method
               * @example POST
               */
              uploadMethod: string;
              /**
               * @description Secret key
               * @example xxxxxxxx
               */
              token: string;
              /**
               * @example {
               *   "Content-Type": "image/png"
               * }
               */
              requestHeaders: {
                [key: string]: unknown;
              };
            };
          };
        };
      };
    };
  };
  "/attachments/upload/{token}": {
    /** @description Upload attachment */
    post: {
      parameters: {
        path: {
          token: string;
        };
      };
      /** @description upload attachment */
      requestBody: {
        content: {
          "application/json": string;
        };
      };
      responses: {
        /** @description Upload successful */
        201: {
          content: never;
        };
      };
    };
  };
  "/base/import": {
    /**
     * import a base
     * @description import a base
     */
    post: {
      requestBody?: {
        content: {
          "application/json": {
            notify: {
              /**
               * @description Token for the uploaded file
               * @example xxxxxxxxxxx
               */
              token: string;
              /**
               * @description File size in bytes
               * @example 1024
               */
              size: number;
              /**
               * @description URL of the uploaded file
               * @example /bucket/xxxxx
               */
              url: string;
              /**
               * @description file path
               * @example /table/xxxxxx
               */
              path: string;
              /**
               * @description MIME type of the uploaded file
               * @example video/mp4
               */
              mimetype: string;
              /**
               * @description Image width of the uploaded file
               * @example 100
               */
              width?: number;
              /**
               * @description Image height of the uploaded file
               * @example 100
               */
              height?: number;
              /** @description Preview url */
              presignedUrl: string;
            };
            spaceId: string;
          };
        };
      };
      responses: {
        /** @description import successfully */
        200: {
          content: never;
        };
      };
    };
  };
  "/base/{baseId}/move": {
    /**
     * move a base to another space
     * @description move a base to another space
     */
    put: {
      parameters: {
        path: {
          baseId: string;
        };
      };
      requestBody?: {
        content: {
          "application/json": {
            spaceId: string;
          };
        };
      };
      responses: {
        /** @description move to another space successfully */
        200: {
          content: never;
        };
      };
    };
  };
  "/base/{baseId}/erd": {
    /** @description Get the erd of a base */
    get: {
      parameters: {
        path: {
          baseId: string;
        };
      };
      responses: {
        /** @description Returns the erd of a base. */
        200: {
          content: {
            "application/json": {
              baseId: string;
              nodes: ({
                  id: string;
                  name: string;
                  icon?: string;
                  crossBaseId?: string;
                  crossBaseName?: string;
                  fields: ({
                      /** @description The id of the field. */
                      id: string;
                      /**
                       * @description The name of the field. can not be duplicated in the table.
                       * @example Tags
                       */
                      name: string;
                      /**
                       * @description The field types supported by teable.
                       * @example singleSelect
                       * @enum {string}
                       */
                      type: "singleLineText" | "longText" | "user" | "attachment" | "checkbox" | "multipleSelect" | "singleSelect" | "date" | "number" | "rating" | "formula" | "rollup" | "link" | "createdTime" | "lastModifiedTime" | "createdBy" | "lastModifiedBy" | "autoNumber" | "button" | "department" | "createdByDepartment" | "lastModifiedByDepartment";
                      /** @description Whether this field is lookup field. witch means cellValue and [fieldType] is looked up from the linked table. */
                      isLookup?: boolean;
                      /** @description Whether this field is primary field. */
                      isPrimary?: boolean;
                    })[];
                })[];
              edges: ({
                  source: {
                    tableId: string;
                    tableName: string;
                    fieldId: string;
                    fieldName: string;
                  };
                  target: {
                    tableId: string;
                    tableName: string;
                    fieldId: string;
                    fieldName: string;
                  };
                  /** @enum {string} */
                  relationship?: "oneOne" | "manyMany" | "oneMany" | "manyOne";
                  isOneWay?: boolean;
                  type: ("singleLineText" | "longText" | "user" | "attachment" | "checkbox" | "multipleSelect" | "singleSelect" | "date" | "number" | "rating" | "formula" | "rollup" | "link" | "createdTime" | "lastModifiedTime" | "createdBy" | "lastModifiedBy" | "autoNumber" | "button" | "department" | "createdByDepartment" | "lastModifiedByDepartment") | "lookup";
                })[];
            };
          };
        };
      };
    };
  };
  "/space/{spaceId}/base": {
    /** @description Get base list by query */
    get: {
      parameters: {
        path: {
          spaceId: string;
        };
      };
      responses: {
        /** @description Returns the list of base. */
        200: {
          content: {
            "application/json": ({
                id: string;
                name: string;
                spaceId: string;
                icon: string | null;
                /** @enum {string} */
                role: "owner" | "creator" | "editor" | "commenter" | "viewer";
                /** @enum {string} */
                collaboratorType?: "space" | "base";
                restrictedAuthority?: boolean;
              })[];
          };
        };
      };
    };
  };
  "/space/{spaceId}/permanent": {
    /** @description Permanently delete a space by spaceId */
    delete: {
      parameters: {
        path: {
          spaceId: string;
        };
      };
      responses: {
        /** @description Permanently deleted successfully */
        200: {
          content: never;
        };
      };
    };
  };
  "/mail-sender/test-transport-config": {
    /** @description Test mail transporter */
    post: {
      requestBody?: {
        content: {
          "application/json": {
            /** Format: email */
            to: string;
            message?: string;
            transportConfig: {
              senderName?: string;
              sender: string;
              host: string;
              port: number;
              secure?: boolean;
              auth: {
                user: string;
                pass: string;
              };
            };
          };
        };
      };
      responses: {
        /** @description Test mail transporter successfully. */
        200: {
          content: never;
        };
      };
    };
  };
  "/admin/setting": {
    /** @description Get the instance settings */
    get: {
      responses: {
        /** @description Returns the instance settings. */
        200: {
          content: {
            "application/json": {
              instanceId: string;
              brandName?: string | null;
              brandLogo?: string | null;
              disallowSignUp?: boolean | null;
              disallowSpaceCreation?: boolean | null;
              disallowSpaceInvitation?: boolean | null;
              enableEmailVerification?: boolean | null;
              enableWaitlist?: boolean | null;
              aiConfig?: ({
                /** @default [] */
                llmProviders?: ({
                    /** @enum {string} */
                    type: "openai" | "anthropic" | "google" | "azure" | "cohere" | "mistral" | "deepseek" | "qwen" | "zhipu" | "lingyiwanwu" | "xai" | "togetherai" | "ollama" | "amazonBedrock" | "openRouter";
                    name: string;
                    apiKey?: string;
                    /** Format: uri */
                    baseUrl?: string;
                    /** @default */
                    models?: string;
                    isInstance?: boolean;
                  })[];
                embeddingModel?: string;
                translationModel?: string;
                chatModel?: {
                  lg?: string;
                  md?: string;
                  sm?: string;
                  ability?: {
                    image?: boolean;
                    pdf?: boolean;
                    webSearch?: boolean;
                  };
                };
                capabilities?: {
                  disableActions?: string[];
                };
                enable?: boolean;
              }) | null;
              notifyMailTransportConfig?: {
                senderName?: string;
                sender: string;
                host: string;
                port: number;
                secure?: boolean;
                auth: {
                  user: string;
                  pass: string;
                };
              } | null;
              automationMailTransportConfig?: {
                senderName?: string;
                sender: string;
                host: string;
                port: number;
                secure?: boolean;
                auth: {
                  user: string;
                  pass: string;
                };
              } | null;
              appConfig?: {
                apiKey?: string;
                creditCount?: number;
              } | null;
              webSearchConfig?: {
                apiKey?: string;
              } | null;
              createdTime?: string;
            };
          };
        };
      };
    };
    /** @description Get the instance settings */
    patch: {
      requestBody?: {
        content: {
          "application/json": {
            disallowSignUp?: boolean;
            disallowSpaceCreation?: boolean;
            disallowSpaceInvitation?: boolean;
            enableEmailVerification?: boolean;
            aiConfig?: {
              /** @default [] */
              llmProviders?: ({
                  /** @enum {string} */
                  type: "openai" | "anthropic" | "google" | "azure" | "cohere" | "mistral" | "deepseek" | "qwen" | "zhipu" | "lingyiwanwu" | "xai" | "togetherai" | "ollama" | "amazonBedrock" | "openRouter";
                  name: string;
                  apiKey?: string;
                  /** Format: uri */
                  baseUrl?: string;
                  /** @default */
                  models?: string;
                  isInstance?: boolean;
                })[];
              embeddingModel?: string;
              translationModel?: string;
              chatModel?: {
                lg?: string;
                md?: string;
                sm?: string;
                ability?: {
                  image?: boolean;
                  pdf?: boolean;
                  webSearch?: boolean;
                };
              };
              capabilities?: {
                disableActions?: string[];
              };
              enable?: boolean;
            };
            enableWaitlist?: boolean;
            appConfig?: {
              apiKey?: string;
              creditCount?: number;
            };
            webSearchConfig?: {
              apiKey?: string;
            };
            brandName?: string;
          };
        };
      };
      responses: {
        /** @description Update settings successfully. */
        200: {
          content: never;
        };
      };
    };
  };
  "/admin/setting/public": {
    /** @description Get the public instance settings */
    get: {
      responses: {
        /** @description Returns the public instance settings. */
        200: {
          content: {
            "application/json": {
              instanceId: string;
              brandName?: string | null;
              brandLogo?: string | null;
              disallowSignUp?: boolean | null;
              disallowSpaceCreation?: boolean | null;
              disallowSpaceInvitation?: boolean | null;
              enableEmailVerification?: boolean | null;
              enableWaitlist?: boolean | null;
              createdTime?: string;
              aiConfig: ({
                enable: boolean;
                llmProviders: ({
                    /** @enum {string} */
                    type: "openai" | "anthropic" | "google" | "azure" | "cohere" | "mistral" | "deepseek" | "qwen" | "zhipu" | "lingyiwanwu" | "xai" | "togetherai" | "ollama" | "amazonBedrock" | "openRouter";
                    name: string;
                    /** @default */
                    models?: string;
                    isInstance?: boolean;
                  })[];
                chatModel?: {
                  lg?: string;
                  md?: string;
                  sm?: string;
                  ability?: {
                    image?: boolean;
                    pdf?: boolean;
                    webSearch?: boolean;
                  };
                };
                capabilities?: {
                  disableActions?: string[];
                };
              }) | null;
              webSearchEnabled?: boolean;
              appGenerationEnabled?: boolean;
              turnstileSiteKey?: string | null;
              signupVerificationCodeRateLimitSeconds?: number;
            };
          };
        };
      };
    };
  };
  "/admin/setting/logo": {
    /** @description Upload logo */
    patch: {
      requestBody?: {
        content: {
          "multipart/form-data": {
            /** Format: binary */
            file: string;
          };
        };
      };
      responses: {
        /** @description Successfully upload logo. */
        200: {
          content: {
            "application/json": {
              url: string;
            };
          };
        };
      };
    };
  };
  "/admin/setting/test-llm": {
    /** @description Test LLM provider configuration */
    post: {
      requestBody?: {
        content: {
          "application/json": {
            /** @enum {string} */
            type: "openai" | "anthropic" | "google" | "azure" | "cohere" | "mistral" | "deepseek" | "qwen" | "zhipu" | "lingyiwanwu" | "xai" | "togetherai" | "ollama" | "amazonBedrock" | "openRouter";
            name: string;
            apiKey: string;
            /** Format: uri */
            baseUrl: string;
            /** @default */
            models?: string;
            modelKey?: string;
            ability?: ("image" | "pdf" | "webSearch")[];
          };
        };
      };
      responses: {
        /** @description Test result */
        200: {
          content: {
            "application/json": {
              success: boolean;
              response?: string;
              ability?: {
                image?: boolean;
                pdf?: boolean;
                webSearch?: boolean;
              };
            };
          };
        };
      };
    };
  };
  "/admin/setting/set-mail-transport-config": {
    /** @description Set mail transporter */
    put: {
      requestBody?: {
        content: {
          "application/json": {
            name: "notifyMailTransportConfig" | "automationMailTransportConfig";
            transportConfig: {
              senderName?: string;
              sender: string;
              host: string;
              port: number;
              secure?: boolean;
              auth: {
                user: string;
                pass: string;
              };
            };
          };
        };
      };
      responses: {
        /** @description Set mail transporter successfully. */
        200: {
          content: {
            "application/json": {
              name: "notifyMailTransportConfig" | "automationMailTransportConfig";
              transportConfig: {
                senderName?: string;
                sender: string;
                host: string;
                port: number;
                secure?: boolean;
                auth: {
                  user: string;
                  pass: string;
                };
              };
            };
          };
        };
      };
    };
  };
  "/admin/plugin/{pluginId}/publish": {
    /** @description Publish a plugin */
    patch: {
      parameters: {
        path: {
          pluginId: string;
        };
      };
      responses: {
        /** @description Plugin published successfully. */
        200: {
          content: never;
        };
      };
    };
  };
  "/admin/plugin/{pluginId}/unpublish": {
    /** @description Admin unpublish a plugin */
    patch: {
      parameters: {
        path: {
          pluginId: string;
        };
      };
      responses: {
        /** @description Plugin unpublished successfully. */
        200: {
          content: never;
        };
      };
    };
  };
  "/admin/enterprise-license/status": {
    /** @description Get enterprise license expiration status */
    get: {
      responses: {
        /** @description Returns enterprise license expiration status. */
        200: {
          content: {
            "application/json": {
              expiredTime?: string | null;
            };
          };
        };
      };
    };
  };
  "/space/{spaceId}/integration": {
    /** @description Get integration list by query */
    get: {
      parameters: {
        path: {
          spaceId: string;
        };
      };
      responses: {
        /** @description Returns the list of integration. */
        200: {
          content: {
            "application/json": ({
                id: string;
                spaceId: string;
                /** @enum {string} */
                type: "AI";
                enable?: boolean;
                config: {
                  /** @default [] */
                  llmProviders?: ({
                      /** @enum {string} */
                      type: "openai" | "anthropic" | "google" | "azure" | "cohere" | "mistral" | "deepseek" | "qwen" | "zhipu" | "lingyiwanwu" | "xai" | "togetherai" | "ollama" | "amazonBedrock" | "openRouter";
                      name: string;
                      apiKey?: string;
                      /** Format: uri */
                      baseUrl?: string;
                      /** @default */
                      models?: string;
                      isInstance?: boolean;
                    })[];
                  embeddingModel?: string;
                  translationModel?: string;
                  chatModel?: {
                    lg?: string;
                    md?: string;
                    sm?: string;
                    ability?: {
                      image?: boolean;
                      pdf?: boolean;
                      webSearch?: boolean;
                    };
                  };
                  capabilities?: {
                    disableActions?: string[];
                  };
                  appConfig?: {
                    apiKey?: string;
                    creditCount?: number;
                  };
                  webSearchConfig?: {
                    apiKey?: string;
                  };
                };
                createdTime: string;
                lastModifiedTime?: string;
              })[];
          };
        };
      };
    };
    /** @description Create a integration to a space */
    post: {
      parameters: {
        path: {
          spaceId: string;
        };
      };
      requestBody?: {
        content: {
          "application/json": {
            /** @enum {string} */
            type: "AI";
            enable?: boolean;
            config: {
              /** @default [] */
              llmProviders?: ({
                  /** @enum {string} */
                  type: "openai" | "anthropic" | "google" | "azure" | "cohere" | "mistral" | "deepseek" | "qwen" | "zhipu" | "lingyiwanwu" | "xai" | "togetherai" | "ollama" | "amazonBedrock" | "openRouter";
                  name: string;
                  apiKey?: string;
                  /** Format: uri */
                  baseUrl?: string;
                  /** @default */
                  models?: string;
                  isInstance?: boolean;
                })[];
              embeddingModel?: string;
              translationModel?: string;
              chatModel?: {
                lg?: string;
                md?: string;
                sm?: string;
                ability?: {
                  image?: boolean;
                  pdf?: boolean;
                  webSearch?: boolean;
                };
              };
              capabilities?: {
                disableActions?: string[];
              };
              appConfig?: {
                apiKey?: string;
                creditCount?: number;
              };
              webSearchConfig?: {
                apiKey?: string;
              };
            };
          };
        };
      };
      responses: {
        /** @description Successful response. */
        200: {
          content: never;
        };
      };
    };
  };
  "/space/{spaceId}/integration/{integrationId}": {
    /** @description Delete a integration by integrationId */
    delete: {
      parameters: {
        path: {
          spaceId: string;
          integrationId: string;
        };
      };
      responses: {
        /** @description Deleted successfully */
        200: {
          content: never;
        };
      };
    };
    /** @description Update a integration to a space */
    patch: {
      parameters: {
        path: {
          spaceId: string;
          integrationId: string;
        };
      };
      requestBody?: {
        content: {
          "application/json": {
            enable?: boolean;
            config?: {
              /** @default [] */
              llmProviders?: ({
                  /** @enum {string} */
                  type: "openai" | "anthropic" | "google" | "azure" | "cohere" | "mistral" | "deepseek" | "qwen" | "zhipu" | "lingyiwanwu" | "xai" | "togetherai" | "ollama" | "amazonBedrock" | "openRouter";
                  name: string;
                  apiKey?: string;
                  /** Format: uri */
                  baseUrl?: string;
                  /** @default */
                  models?: string;
                  isInstance?: boolean;
                })[];
              embeddingModel?: string;
              translationModel?: string;
              chatModel?: {
                lg?: string;
                md?: string;
                sm?: string;
                ability?: {
                  image?: boolean;
                  pdf?: boolean;
                  webSearch?: boolean;
                };
              };
              capabilities?: {
                disableActions?: string[];
              };
              appConfig?: {
                apiKey?: string;
                creditCount?: number;
              };
              webSearchConfig?: {
                apiKey?: string;
              };
            };
          };
        };
      };
      responses: {
        /** @description Successful response. */
        200: {
          content: never;
        };
      };
    };
  };
  "/trash": {
    /** @description Get trash list for spaces or bases */
    get: {
      parameters: {
        query: {
          resourceType: "space" | "base";
        };
      };
      responses: {
        /** @description Get trash successfully */
        200: {
          content: {
            "application/json": {
              trashItems: (({
                  id: string;
                  resourceId: string;
                  /** @enum {string} */
                  resourceType: "space" | "base" | "table";
                  deletedTime: string;
                  deletedBy: string;
                }) | ({
                  id: string;
                  resourceIds: string[];
                  /** @enum {string} */
                  resourceType: "view" | "field" | "record";
                  deletedTime: string;
                  deletedBy: string;
                }))[];
              userMap: {
                [key: string]: {
                  email: string;
                  avatar: string | null;
                  id: string;
                  name: string;
                };
              };
              resourceMap: {
                [key: string]: {
                  id: string;
                  name: string;
                } | {
                  id: string;
                  spaceId: string;
                  name: string;
                } | ({
                  id: string;
                  name: string;
                  /** @enum {string} */
                  type: "grid" | "calendar" | "kanban" | "form" | "gallery" | "plugin";
                }) | ({
                  id: string;
                  name: string;
                  /** @enum {string} */
                  type: "singleLineText" | "longText" | "user" | "attachment" | "checkbox" | "multipleSelect" | "singleSelect" | "date" | "number" | "rating" | "formula" | "rollup" | "link" | "createdTime" | "lastModifiedTime" | "createdBy" | "lastModifiedBy" | "autoNumber" | "button" | "department" | "createdByDepartment" | "lastModifiedByDepartment";
                  isLookup: boolean | null;
                  options?: string[] | null;
                });
              };
              nextCursor?: string | null;
            };
          };
        };
      };
    };
  };
  "/trash/items": {
    /** @description Get trash items for base or table */
    get: {
      parameters: {
        query: {
          resourceId: string;
          resourceType: "base" | "table";
          cursor?: string | null;
        };
      };
      responses: {
        /** @description Get trash successfully */
        200: {
          content: {
            "application/json": {
              trashItems: (({
                  id: string;
                  resourceId: string;
                  /** @enum {string} */
                  resourceType: "space" | "base" | "table";
                  deletedTime: string;
                  deletedBy: string;
                }) | ({
                  id: string;
                  resourceIds: string[];
                  /** @enum {string} */
                  resourceType: "view" | "field" | "record";
                  deletedTime: string;
                  deletedBy: string;
                }))[];
              userMap: {
                [key: string]: {
                  email: string;
                  avatar: string | null;
                  id: string;
                  name: string;
                };
              };
              resourceMap: {
                [key: string]: {
                  id: string;
                  name: string;
                } | {
                  id: string;
                  spaceId: string;
                  name: string;
                } | ({
                  id: string;
                  name: string;
                  /** @enum {string} */
                  type: "grid" | "calendar" | "kanban" | "form" | "gallery" | "plugin";
                }) | ({
                  id: string;
                  name: string;
                  /** @enum {string} */
                  type: "singleLineText" | "longText" | "user" | "attachment" | "checkbox" | "multipleSelect" | "singleSelect" | "date" | "number" | "rating" | "formula" | "rollup" | "link" | "createdTime" | "lastModifiedTime" | "createdBy" | "lastModifiedBy" | "autoNumber" | "button" | "department" | "createdByDepartment" | "lastModifiedByDepartment";
                  isLookup: boolean | null;
                  options?: string[] | null;
                });
              };
              nextCursor?: string | null;
            };
          };
        };
      };
    };
  };
  "/trash/reset-items": {
    /** @description Reset trash items for a base or table */
    delete: {
      parameters: {
        query: {
          resourceId: string;
          resourceType: "base" | "table";
          cursor?: string | null;
        };
      };
      responses: {
        /** @description Reset successfully */
        200: {
          content: never;
        };
      };
    };
  };
  "/trash/restore/{trashId}": {
    /** @description restore a space, base, table, etc. */
    post: {
      parameters: {
        path: {
          trashId: string;
        };
      };
      responses: {
        /** @description Restored successfully */
        201: {
          content: never;
        };
      };
    };
  };
  "/table/{tableId}/record/{recordId}/history": {
    /**
     * Get record history
     * @description Retrieve the change history of a specific record, including field modifications and user information.
     */
    get: {
      parameters: {
        path: {
          tableId: string;
          recordId: string;
        };
      };
      responses: {
        /** @description Get the history list for a record */
        200: {
          content: {
            "application/json": {
              historyList: ({
                  id: string;
                  tableId: string;
                  recordId: string;
                  fieldId: string;
                  before: {
                    meta: {
                      /**
                       * @description The name of the field. can not be duplicated in the table.
                       * @example Tags
                       */
                      name: string;
                      /**
                       * @description The field types supported by teable.
                       * @example singleSelect
                       * @enum {string}
                       */
                      type: "singleLineText" | "longText" | "user" | "attachment" | "checkbox" | "multipleSelect" | "singleSelect" | "date" | "number" | "rating" | "formula" | "rollup" | "link" | "createdTime" | "lastModifiedTime" | "createdBy" | "lastModifiedBy" | "autoNumber" | "button" | "department" | "createdByDepartment" | "lastModifiedByDepartment";
                      /**
                       * @description The cell value type of the field.
                       * @enum {string}
                       */
                      cellValueType: "string" | "number" | "boolean" | "dateTime";
                      options?: unknown;
                    };
                    data?: unknown;
                  };
                  after: {
                    meta: {
                      /**
                       * @description The name of the field. can not be duplicated in the table.
                       * @example Tags
                       */
                      name: string;
                      /**
                       * @description The field types supported by teable.
                       * @example singleSelect
                       * @enum {string}
                       */
                      type: "singleLineText" | "longText" | "user" | "attachment" | "checkbox" | "multipleSelect" | "singleSelect" | "date" | "number" | "rating" | "formula" | "rollup" | "link" | "createdTime" | "lastModifiedTime" | "createdBy" | "lastModifiedBy" | "autoNumber" | "button" | "department" | "createdByDepartment" | "lastModifiedByDepartment";
                      /**
                       * @description The cell value type of the field.
                       * @enum {string}
                       */
                      cellValueType: "string" | "number" | "boolean" | "dateTime";
                      options?: unknown;
                    };
                    data?: unknown;
                  };
                  createdTime: string;
                  createdBy: string;
                })[];
              userMap: {
                [key: string]: {
                  email: string;
                  avatar: string | null;
                  id: string;
                  name: string;
                };
              };
              nextCursor?: string | null;
            };
          };
        };
      };
    };
  };
  "/table/{tableId}/record/history": {
    /**
     * Get table records history
     * @description Retrieve the change history of all records in a table, including field modifications and user information.
     */
    get: {
      parameters: {
        path: {
          tableId: string;
        };
      };
      responses: {
        /** @description Get the history list of all records in a table */
        200: {
          content: {
            "application/json": {
              historyList: ({
                  id: string;
                  tableId: string;
                  recordId: string;
                  fieldId: string;
                  before: {
                    meta: {
                      /**
                       * @description The name of the field. can not be duplicated in the table.
                       * @example Tags
                       */
                      name: string;
                      /**
                       * @description The field types supported by teable.
                       * @example singleSelect
                       * @enum {string}
                       */
                      type: "singleLineText" | "longText" | "user" | "attachment" | "checkbox" | "multipleSelect" | "singleSelect" | "date" | "number" | "rating" | "formula" | "rollup" | "link" | "createdTime" | "lastModifiedTime" | "createdBy" | "lastModifiedBy" | "autoNumber" | "button" | "department" | "createdByDepartment" | "lastModifiedByDepartment";
                      /**
                       * @description The cell value type of the field.
                       * @enum {string}
                       */
                      cellValueType: "string" | "number" | "boolean" | "dateTime";
                      options?: unknown;
                    };
                    data?: unknown;
                  };
                  after: {
                    meta: {
                      /**
                       * @description The name of the field. can not be duplicated in the table.
                       * @example Tags
                       */
                      name: string;
                      /**
                       * @description The field types supported by teable.
                       * @example singleSelect
                       * @enum {string}
                       */
                      type: "singleLineText" | "longText" | "user" | "attachment" | "checkbox" | "multipleSelect" | "singleSelect" | "date" | "number" | "rating" | "formula" | "rollup" | "link" | "createdTime" | "lastModifiedTime" | "createdBy" | "lastModifiedBy" | "autoNumber" | "button" | "department" | "createdByDepartment" | "lastModifiedByDepartment";
                      /**
                       * @description The cell value type of the field.
                       * @enum {string}
                       */
                      cellValueType: "string" | "number" | "boolean" | "dateTime";
                      options?: unknown;
                    };
                    data?: unknown;
                  };
                  createdTime: string;
                  createdBy: string;
                })[];
              userMap: {
                [key: string]: {
                  email: string;
                  avatar: string | null;
                  id: string;
                  name: string;
                };
              };
              nextCursor?: string | null;
            };
          };
        };
      };
    };
  };
  "/table/{tableId}/record/{recordId}/{fieldId}/uploadAttachment": {
    /**
     * Upload attachment
     * @description Upload an attachment from a file or URL and append it to the cell
     */
    post: {
      parameters: {
        path: {
          tableId: string;
          recordId: string;
          fieldId: string;
        };
      };
      /** @description upload attachment */
      requestBody: {
        content: {
          "multipart/form-data": {
            /** Format: binary */
            file?: string;
            fileUrl?: string;
          };
        };
      };
      responses: {
        /** @description Returns record data after update. */
        201: {
          content: {
            "application/json": {
              /** @description The record id. */
              id: string;
              /** @description primary field value */
              name?: string;
              /** @description Objects with a fields key mapping fieldId or field name to value for that field. */
              fields: {
                [key: string]: unknown;
              };
              /** @description Auto number, a unique identifier for each record */
              autoNumber?: number;
              /** @description Created time, date ISO string (new Date().toISOString). */
              createdTime?: string;
              /** @description Last modified time, date ISO string (new Date().toISOString). */
              lastModifiedTime?: string;
              /** @description Created by, user name */
              createdBy?: string;
              /** @description Last modified by, user name */
              lastModifiedBy?: string;
              /** @description Permissions for the record */
              permissions?: {
                [key: string]: {
                  [key: string]: boolean;
                };
              };
              /** @description Whether the record is undeletable */
              undeletable?: boolean;
            };
          };
        };
      };
    };
  };
  "/table/{tableId}/record/{recordId}/status": {
    /**
     * Get record status
     * @description Retrieve the visibility and deletion status of a specific record.
     */
    get: {
      parameters: {
        query?: {
          projection?: string[];
          cellFormat?: "json" | "text";
          /** @description Define the key type of record.fields[key], You can click "systemInfo" in the field edit box to get fieldId or enter the table design screen with all the field details */
          fieldKeyType?: "id" | "name" | "dbFieldName";
          viewId?: string;
          ignoreViewQuery?: string | boolean;
          filterByTql?: string;
          filter?: string;
          search?: string[] | ((string | (string | boolean))[]);
          filterLinkCellCandidate?: string[] | string;
          filterLinkCellSelected?: string[] | string;
          selectedRecordIds?: string[];
          orderBy?: string;
          groupBy?: string;
          collapsedGroupIds?: string;
          queryId?: string;
          take?: string | number;
          skip?: string | number;
        };
        path: {
          tableId: string;
          recordId: string;
        };
      };
      responses: {
        /** @description List of records */
        200: {
          content: {
            "application/json": {
              isVisible: boolean;
              isDeleted: boolean;
            };
          };
        };
      };
    };
  };
  "/table/{tableId}/record/{recordId}/{fieldId}/auto-fill": {
    /**
     * Auto-fill a cell by AI
     * @description Automatically fill a cell in a specific record and field
     */
    post: {
      parameters: {
        path: {
          tableId: string;
          recordId: string;
          fieldId: string;
        };
      };
      responses: {
        /** @description Returns the updated record status */
        200: {
          content: {
            "application/json": {
              status: string;
            };
          };
        };
      };
    };
  };
  "/table/{tableId}/record/{recordId}/{fieldId}/button-click": {
    /**
     * Button click
     * @description Button click
     */
    post: {
      parameters: {
        path: {
          tableId: string;
          recordId: string;
          fieldId: string;
        };
      };
      responses: {
        /** @description Returns the clicked cell */
        200: {
          content: {
            "application/json": {
              runId: string;
              tableId: string;
              fieldId: string;
              record: {
                /** @description The record id. */
                id: string;
                /** @description primary field value */
                name?: string;
                /** @description Objects with a fields key mapping fieldId or field name to value for that field. */
                fields: {
                  [key: string]: unknown;
                };
                /** @description Auto number, a unique identifier for each record */
                autoNumber?: number;
                /** @description Created time, date ISO string (new Date().toISOString). */
                createdTime?: string;
                /** @description Last modified time, date ISO string (new Date().toISOString). */
                lastModifiedTime?: string;
                /** @description Created by, user name */
                createdBy?: string;
                /** @description Last modified by, user name */
                lastModifiedBy?: string;
                /** @description Permissions for the record */
                permissions?: {
                  [key: string]: {
                    [key: string]: boolean;
                  };
                };
                /** @description Whether the record is undeletable */
                undeletable?: boolean;
              };
            };
          };
        };
      };
    };
  };
  "/table/{tableId}/record/{recordId}/{fieldId}/button-reset": {
    /**
     * Button reset
     * @description Button reset
     */
    post: {
      parameters: {
        path: {
          tableId: string;
          recordId: string;
          fieldId: string;
        };
      };
      responses: {
        /** @description Returns the reset cell */
        200: {
          content: {
            "application/json": {
              /** @description The record id. */
              id: string;
              /** @description primary field value */
              name?: string;
              /** @description Objects with a fields key mapping fieldId or field name to value for that field. */
              fields: {
                [key: string]: unknown;
              };
              /** @description Auto number, a unique identifier for each record */
              autoNumber?: number;
              /** @description Created time, date ISO string (new Date().toISOString). */
              createdTime?: string;
              /** @description Last modified time, date ISO string (new Date().toISOString). */
              lastModifiedTime?: string;
              /** @description Created by, user name */
              createdBy?: string;
              /** @description Last modified by, user name */
              lastModifiedBy?: string;
              /** @description Permissions for the record */
              permissions?: {
                [key: string]: {
                  [key: string]: boolean;
                };
              };
              /** @description Whether the record is undeletable */
              undeletable?: boolean;
            };
          };
        };
      };
    };
  };
  "/table/{tableId}/field": {
    /**
     * List fields
     * @description Retrieve a list of fields in a table with optional filtering
     */
    get: {
      parameters: {
        query?: {
          viewId?: string;
          filterHidden?: boolean | null;
          projection?: string[];
        };
        path: {
          tableId: string;
        };
      };
      responses: {
        /** @description Returns the list of field. */
        200: {
          content: {
            "application/json": ({
                /** @description The id of the field. */
                id: string;
                /**
                 * @description The name of the field. can not be duplicated in the table.
                 * @example Tags
                 */
                name: string;
                /**
                 * @description The field types supported by teable.
                 * @example singleSelect
                 * @enum {string}
                 */
                type: "singleLineText" | "longText" | "user" | "attachment" | "checkbox" | "multipleSelect" | "singleSelect" | "date" | "number" | "rating" | "formula" | "rollup" | "link" | "createdTime" | "lastModifiedTime" | "createdBy" | "lastModifiedBy" | "autoNumber" | "button" | "department" | "createdByDepartment" | "lastModifiedByDepartment";
                /**
                 * @description The description of the field.
                 * @example this is a summary
                 */
                description?: string;
                /** @description The configuration options of the field. The structure of the field's options depend on the field's type. */
                options: ({
                  /** @enum {string} */
                  expression: "countall({values})" | "counta({values})" | "count({values})" | "sum({values})" | "max({values})" | "min({values})" | "and({values})" | "or({values})" | "xor({values})" | "array_join({values})" | "array_unique({values})" | "array_compact({values})" | "concatenate({values})";
                  /** @description The time zone that should be used to format dates */
                  timeZone?: string;
                  /** @description Different cell value types are determined based on the results of expression parsing, where numbers, dates, and formatting options are provided */
                  formatting?: ({
                    /** @description the display formatting of the date. you can use the following presets: M/D/YYYY, D/M/YYYY, YYYY/MM/DD, YYYY-MM-DD, YYYY-MM, MM-DD, YYYY, MM, DD */
                    date: string;
                    /**
                     * @description the display formatting of the time. you can use the following presets: HH:mm, hh:mm A, None
                     * @enum {string}
                     */
                    time: "HH:mm" | "hh:mm A" | "None";
                    /** @description The time zone that should be used to format dates */
                    timeZone: string;
                  }) | {
                    precision: number;
                    /** @enum {string} */
                    type: "decimal";
                  } | {
                    precision: number;
                    /** @enum {string} */
                    type: "percent";
                  } | {
                    precision: number;
                    /** @enum {string} */
                    type: "currency";
                    symbol: string;
                  };
                  /** @description According to the results of expression parsing to determine different visual effects, where strings, numbers will provide customized "show as" */
                  showAs?: ({
                    /**
                     * @description can display as url, email or phone in string field with a button to perform the corresponding action, start a phone call, send an email, or open a link in a new tab
                     * @enum {string}
                     */
                    type: "url" | "email" | "phone";
                  }) | ({
                    /**
                     * @description can display as bar or ring in number field with single cellValue value
                     * @enum {string}
                     */
                    type: "bar" | "ring";
                    /** @enum {string} */
                    color: "blueLight2" | "blueLight1" | "blueBright" | "blue" | "blueDark1" | "cyanLight2" | "cyanLight1" | "cyanBright" | "cyan" | "cyanDark1" | "grayLight2" | "grayLight1" | "grayBright" | "gray" | "grayDark1" | "greenLight2" | "greenLight1" | "greenBright" | "green" | "greenDark1" | "orangeLight2" | "orangeLight1" | "orangeBright" | "orange" | "orangeDark1" | "pinkLight2" | "pinkLight1" | "pinkBright" | "pink" | "pinkDark1" | "purpleLight2" | "purpleLight1" | "purpleBright" | "purple" | "purpleDark1" | "redLight2" | "redLight1" | "redBright" | "red" | "redDark1" | "tealLight2" | "tealLight1" | "tealBright" | "teal" | "tealDark1" | "yellowLight2" | "yellowLight1" | "yellowBright" | "yellow" | "yellowDark1";
                    /** @description whether to displays the specific value on the graph */
                    showValue: boolean;
                    /** @description the value that represents a 100% maximum value, it does not represent a hard limit on the value */
                    maxValue: number;
                  }) | ({
                    /**
                     * @description can display as bar or line in number field with multiple cellValue value
                     * @enum {string}
                     */
                    type: "bar" | "line";
                    /** @enum {string} */
                    color: "blueLight2" | "blueLight1" | "blueBright" | "blue" | "blueDark1" | "cyanLight2" | "cyanLight1" | "cyanBright" | "cyan" | "cyanDark1" | "grayLight2" | "grayLight1" | "grayBright" | "gray" | "grayDark1" | "greenLight2" | "greenLight1" | "greenBright" | "green" | "greenDark1" | "orangeLight2" | "orangeLight1" | "orangeBright" | "orange" | "orangeDark1" | "pinkLight2" | "pinkLight1" | "pinkBright" | "pink" | "pinkDark1" | "purpleLight2" | "purpleLight1" | "purpleBright" | "purple" | "purpleDark1" | "redLight2" | "redLight1" | "redBright" | "red" | "redDark1" | "tealLight2" | "tealLight1" | "tealBright" | "teal" | "tealDark1" | "yellowLight2" | "yellowLight1" | "yellowBright" | "yellow" | "yellowDark1";
                  });
                }) | ({
                  /** @description The formula including fields referenced by their IDs. For example, LEFT(4, {Birthday}) input will be returned as LEFT(4, {fldXXX}) via API. The formula syntax in Teable is basically the same as Airtable */
                  expression: string;
                  /** @description The time zone that should be used to format dates */
                  timeZone?: string;
                  /** @description Different cell value types are determined based on the results of expression parsing, where numbers, dates, and formatting options are provided */
                  formatting?: ({
                    /** @description the display formatting of the date. you can use the following presets: M/D/YYYY, D/M/YYYY, YYYY/MM/DD, YYYY-MM-DD, YYYY-MM, MM-DD, YYYY, MM, DD */
                    date: string;
                    /**
                     * @description the display formatting of the time. you can use the following presets: HH:mm, hh:mm A, None
                     * @enum {string}
                     */
                    time: "HH:mm" | "hh:mm A" | "None";
                    /** @description The time zone that should be used to format dates */
                    timeZone: string;
                  }) | {
                    precision: number;
                    /** @enum {string} */
                    type: "decimal";
                  } | {
                    precision: number;
                    /** @enum {string} */
                    type: "percent";
                  } | {
                    precision: number;
                    /** @enum {string} */
                    type: "currency";
                    symbol: string;
                  };
                  /** @description According to the results of expression parsing to determine different visual effects, where strings, numbers will provide customized "show as" */
                  showAs?: ({
                    /**
                     * @description can display as url, email or phone in string field with a button to perform the corresponding action, start a phone call, send an email, or open a link in a new tab
                     * @enum {string}
                     */
                    type: "url" | "email" | "phone";
                  }) | ({
                    /**
                     * @description can display as bar or ring in number field with single cellValue value
                     * @enum {string}
                     */
                    type: "bar" | "ring";
                    /** @enum {string} */
                    color: "blueLight2" | "blueLight1" | "blueBright" | "blue" | "blueDark1" | "cyanLight2" | "cyanLight1" | "cyanBright" | "cyan" | "cyanDark1" | "grayLight2" | "grayLight1" | "grayBright" | "gray" | "grayDark1" | "greenLight2" | "greenLight1" | "greenBright" | "green" | "greenDark1" | "orangeLight2" | "orangeLight1" | "orangeBright" | "orange" | "orangeDark1" | "pinkLight2" | "pinkLight1" | "pinkBright" | "pink" | "pinkDark1" | "purpleLight2" | "purpleLight1" | "purpleBright" | "purple" | "purpleDark1" | "redLight2" | "redLight1" | "redBright" | "red" | "redDark1" | "tealLight2" | "tealLight1" | "tealBright" | "teal" | "tealDark1" | "yellowLight2" | "yellowLight1" | "yellowBright" | "yellow" | "yellowDark1";
                    /** @description whether to displays the specific value on the graph */
                    showValue: boolean;
                    /** @description the value that represents a 100% maximum value, it does not represent a hard limit on the value */
                    maxValue: number;
                  }) | ({
                    /**
                     * @description can display as bar or line in number field with multiple cellValue value
                     * @enum {string}
                     */
                    type: "bar" | "line";
                    /** @enum {string} */
                    color: "blueLight2" | "blueLight1" | "blueBright" | "blue" | "blueDark1" | "cyanLight2" | "cyanLight1" | "cyanBright" | "cyan" | "cyanDark1" | "grayLight2" | "grayLight1" | "grayBright" | "gray" | "grayDark1" | "greenLight2" | "greenLight1" | "greenBright" | "green" | "greenDark1" | "orangeLight2" | "orangeLight1" | "orangeBright" | "orange" | "orangeDark1" | "pinkLight2" | "pinkLight1" | "pinkBright" | "pink" | "pinkDark1" | "purpleLight2" | "purpleLight1" | "purpleBright" | "purple" | "purpleDark1" | "redLight2" | "redLight1" | "redBright" | "red" | "redDark1" | "tealLight2" | "tealLight1" | "tealBright" | "teal" | "tealDark1" | "yellowLight2" | "yellowLight1" | "yellowBright" | "yellow" | "yellowDark1";
                  });
                }) | ({
                  /** @description the base id of the table that this field is linked to, only required for cross base link */
                  baseId?: string;
                  /**
                   * @description describe the relationship from this table to the foreign table
                   * @enum {string}
                   */
                  relationship: "oneOne" | "manyMany" | "oneMany" | "manyOne";
                  /** @description the table this field is linked to */
                  foreignTableId: string;
                  /** @description the field in the foreign table that will be displayed as the current field */
                  lookupFieldId: string;
                  /** @description whether the field is a one-way link, when true, it will not generate a symmetric field, it is generally has better performance */
                  isOneWay?: boolean;
                  /** @description the table name for storing keys, in many-to-many relationships, keys are stored in a separate intermediate table; in other relationships, keys are stored on one side as needed */
                  fkHostTableName: string;
                  /** @description the name of the field that stores the current table primary key */
                  selfKeyName: string;
                  /** @description The name of the field that stores the foreign table primary key */
                  foreignKeyName: string;
                  /** @description the symmetric field in the foreign table, empty if the field is a one-way link */
                  symmetricFieldId?: string;
                  /** @description the view id that limits the number of records in the link field */
                  filterByViewId?: string | null;
                  /** @description the fields that will be displayed in the link field */
                  visibleFieldIds?: string[] | null;
                  /** @description A filter object for complex query conditions based on fields, operators, and values. Use our visual query builder at https://app.teable.ai/developer/tool/query-builder to build filters. */
                  filter?: Record<string, never>;
                }) | ({
                  /** @description caveat: the formatting is just a formatter, it dose not effect the storing value of the record */
                  formatting: {
                    /** @description the display formatting of the date. you can use the following presets: M/D/YYYY, D/M/YYYY, YYYY/MM/DD, YYYY-MM-DD, YYYY-MM, MM-DD, YYYY, MM, DD */
                    date: string;
                    /**
                     * @description the display formatting of the time. you can use the following presets: HH:mm, hh:mm A, None
                     * @enum {string}
                     */
                    time: "HH:mm" | "hh:mm A" | "None";
                    /** @description The time zone that should be used to format dates */
                    timeZone: string;
                  };
                  /**
                   * @description Whether the new row is automatically filled with the current time, caveat: the defaultValue is just a flag, it dose not effect the storing value of the record
                   * @enum {string}
                   */
                  defaultValue?: "now";
                }) | {
                  defaultValue?: boolean;
                } | Record<string, never> | ({
                  /** @description Only be used in single line text field or formula / rollup field with cellValueType equals String and isMultipleCellValue is not true */
                  showAs?: {
                    /**
                     * @description can display as url, email or phone in string field with a button to perform the corresponding action, start a phone call, send an email, or open a link in a new tab
                     * @enum {string}
                     */
                    type: "url" | "email" | "phone";
                  };
                  defaultValue?: string;
                }) | ({
                  /** @enum {string} */
                  icon: "star" | "moon" | "sun" | "zap" | "flame" | "heart" | "apple" | "thumb-up";
                  /** @enum {string} */
                  color: "yellowBright" | "redBright" | "tealBright";
                  max: number;
                }) | ({
                  /** @description Allow adding multiple users */
                  isMultiple?: boolean;
                  /** @description Notify users when their name is added to a cell */
                  shouldNotify?: boolean;
                  defaultValue?: string | "me" | ((string | "me")[]);
                }) | ({
                  /** @description Button label */
                  label: string;
                  /**
                   * @description Button color
                   * @enum {string}
                   */
                  color: "blueLight2" | "blueLight1" | "blueBright" | "blue" | "blueDark1" | "cyanLight2" | "cyanLight1" | "cyanBright" | "cyan" | "cyanDark1" | "grayLight2" | "grayLight1" | "grayBright" | "gray" | "grayDark1" | "greenLight2" | "greenLight1" | "greenBright" | "green" | "greenDark1" | "orangeLight2" | "orangeLight1" | "orangeBright" | "orange" | "orangeDark1" | "pinkLight2" | "pinkLight1" | "pinkBright" | "pink" | "pinkDark1" | "purpleLight2" | "purpleLight1" | "purpleBright" | "purple" | "purpleDark1" | "redLight2" | "redLight1" | "redBright" | "red" | "redDark1" | "tealLight2" | "tealLight1" | "tealBright" | "teal" | "tealDark1" | "yellowLight2" | "yellowLight1" | "yellowBright" | "yellow" | "yellowDark1";
                  /** @description Max count of button clicks */
                  maxCount?: number;
                  /** @description Reset count */
                  resetCount?: boolean;
                  /** @description Workflow */
                  workflow?: {
                    /** @description Workflow ID */
                    id?: string;
                    /** @description Workflow Name */
                    name?: string;
                    /** @description Workflow is active */
                    isActive?: boolean;
                  } | null;
                }) | ({
                  choices: ({
                      id: string;
                      name: string;
                      /** @enum {string} */
                      color: "blueLight2" | "blueLight1" | "blueBright" | "blue" | "blueDark1" | "cyanLight2" | "cyanLight1" | "cyanBright" | "cyan" | "cyanDark1" | "grayLight2" | "grayLight1" | "grayBright" | "gray" | "grayDark1" | "greenLight2" | "greenLight1" | "greenBright" | "green" | "greenDark1" | "orangeLight2" | "orangeLight1" | "orangeBright" | "orange" | "orangeDark1" | "pinkLight2" | "pinkLight1" | "pinkBright" | "pink" | "pinkDark1" | "purpleLight2" | "purpleLight1" | "purpleBright" | "purple" | "purpleDark1" | "redLight2" | "redLight1" | "redBright" | "red" | "redDark1" | "tealLight2" | "tealLight1" | "tealBright" | "teal" | "tealDark1" | "yellowLight2" | "yellowLight1" | "yellowBright" | "yellow" | "yellowDark1";
                    })[];
                  defaultValue?: string | string[];
                  preventAutoNewOptions?: boolean;
                }) | ({
                  /** @description Only be used in number field (number field or formula / rollup field with cellValueType equals Number */
                  formatting: {
                    precision: number;
                    /** @enum {string} */
                    type: "decimal";
                  } | {
                    precision: number;
                    /** @enum {string} */
                    type: "percent";
                  } | {
                    precision: number;
                    /** @enum {string} */
                    type: "currency";
                    symbol: string;
                  };
                  /** @description Only be used in number field (number field or formula / rollup field with cellValueType equals Number */
                  showAs?: ({
                    /**
                     * @description can display as bar or ring in number field with single cellValue value
                     * @enum {string}
                     */
                    type: "bar" | "ring";
                    /** @enum {string} */
                    color: "blueLight2" | "blueLight1" | "blueBright" | "blue" | "blueDark1" | "cyanLight2" | "cyanLight1" | "cyanBright" | "cyan" | "cyanDark1" | "grayLight2" | "grayLight1" | "grayBright" | "gray" | "grayDark1" | "greenLight2" | "greenLight1" | "greenBright" | "green" | "greenDark1" | "orangeLight2" | "orangeLight1" | "orangeBright" | "orange" | "orangeDark1" | "pinkLight2" | "pinkLight1" | "pinkBright" | "pink" | "pinkDark1" | "purpleLight2" | "purpleLight1" | "purpleBright" | "purple" | "purpleDark1" | "redLight2" | "redLight1" | "redBright" | "red" | "redDark1" | "tealLight2" | "tealLight1" | "tealBright" | "teal" | "tealDark1" | "yellowLight2" | "yellowLight1" | "yellowBright" | "yellow" | "yellowDark1";
                    /** @description whether to displays the specific value on the graph */
                    showValue: boolean;
                    /** @description the value that represents a 100% maximum value, it does not represent a hard limit on the value */
                    maxValue: number;
                  }) | ({
                    /**
                     * @description can display as bar or line in number field with multiple cellValue value
                     * @enum {string}
                     */
                    type: "bar" | "line";
                    /** @enum {string} */
                    color: "blueLight2" | "blueLight1" | "blueBright" | "blue" | "blueDark1" | "cyanLight2" | "cyanLight1" | "cyanBright" | "cyan" | "cyanDark1" | "grayLight2" | "grayLight1" | "grayBright" | "gray" | "grayDark1" | "greenLight2" | "greenLight1" | "greenBright" | "green" | "greenDark1" | "orangeLight2" | "orangeLight1" | "orangeBright" | "orange" | "orangeDark1" | "pinkLight2" | "pinkLight1" | "pinkBright" | "pink" | "pinkDark1" | "purpleLight2" | "purpleLight1" | "purpleBright" | "purple" | "purpleDark1" | "redLight2" | "redLight1" | "redBright" | "red" | "redDark1" | "tealLight2" | "tealLight1" | "tealBright" | "teal" | "tealDark1" | "yellowLight2" | "yellowLight1" | "yellowBright" | "yellow" | "yellowDark1";
                  });
                  defaultValue?: number;
                }) | {
                  /** @enum {string} */
                  expression: "AUTO_NUMBER()";
                } | ({
                  /** @enum {string} */
                  expression: "CREATED_TIME()";
                  /** @description caveat: the formatting is just a formatter, it dose not effect the storing value of the record */
                  formatting: {
                    /** @description the display formatting of the date. you can use the following presets: M/D/YYYY, D/M/YYYY, YYYY/MM/DD, YYYY-MM-DD, YYYY-MM, MM-DD, YYYY, MM, DD */
                    date: string;
                    /**
                     * @description the display formatting of the time. you can use the following presets: HH:mm, hh:mm A, None
                     * @enum {string}
                     */
                    time: "HH:mm" | "hh:mm A" | "None";
                    /** @description The time zone that should be used to format dates */
                    timeZone: string;
                  };
                }) | ({
                  /** @enum {string} */
                  expression: "LAST_MODIFIED_TIME()";
                  /** @description caveat: the formatting is just a formatter, it dose not effect the storing value of the record */
                  formatting: {
                    /** @description the display formatting of the date. you can use the following presets: M/D/YYYY, D/M/YYYY, YYYY/MM/DD, YYYY-MM-DD, YYYY-MM, MM-DD, YYYY, MM, DD */
                    date: string;
                    /**
                     * @description the display formatting of the time. you can use the following presets: HH:mm, hh:mm A, None
                     * @enum {string}
                     */
                    time: "HH:mm" | "hh:mm A" | "None";
                    /** @description The time zone that should be used to format dates */
                    timeZone: string;
                  };
                });
                /** @description The AI configuration of the field. */
                aiConfig?: unknown;
                /** @description Whether this field is lookup field. witch means cellValue and [fieldType] is looked up from the linked table. */
                isLookup?: boolean;
                /** @description field lookup options. */
                lookupOptions?: {
                  /** @description the table this field is linked to */
                  foreignTableId: string;
                  /** @description the field in the foreign table that will be displayed as the current field */
                  lookupFieldId: string;
                  /**
                   * @description describe the relationship from this table to the foreign table
                   * @enum {string}
                   */
                  relationship: "oneOne" | "manyMany" | "oneMany" | "manyOne";
                  /** @description the table name for storing keys, in many-to-many relationships, keys are stored in a separate intermediate table; in other relationships, keys are stored on one side as needed */
                  fkHostTableName: string;
                  /** @description the name of the field that stores the current table primary key */
                  selfKeyName: string;
                  /** @description The name of the field that stores the foreign table primary key */
                  foreignKeyName: string;
                  /** @description A filter object for complex query conditions based on fields, operators, and values. Use our visual query builder at https://app.teable.ai/developer/tool/query-builder to build filters. */
                  filter?: Record<string, never>;
                  /** @description The id of Linked record field to use for lookup */
                  linkFieldId: string;
                };
                /** @description Whether this field is not null. */
                notNull?: boolean;
                /** @description Whether this field is not unique. */
                unique?: boolean;
                /** @description Whether this field is primary field. */
                isPrimary?: boolean;
                /** @description Whether this field is computed field, you can not modify cellValue in computed field. */
                isComputed?: boolean;
                /** @description Whether this field's calculation is pending. */
                isPending?: boolean;
                /** @description Whether This field has a configuration error. Check the fields referenced by this field's formula or configuration. */
                hasError?: boolean;
                /**
                 * @description The cell value type of the field.
                 * @enum {string}
                 */
                cellValueType: "string" | "number" | "boolean" | "dateTime";
                /** @description Whether this field has multiple cell value. */
                isMultipleCellValue?: boolean;
                /**
                 * @description The field type of database that cellValue really store.
                 * @enum {string}
                 */
                dbFieldType: "TEXT" | "INTEGER" | "DATETIME" | "REAL" | "BLOB" | "JSON" | "BOOLEAN";
                /** @description Field(column) name in backend database. Limitation: 1-63 characters, can only contain letters, numbers and underscore, case sensitive, cannot be duplicated with existing db field name in the table. */
                dbFieldName: string;
                /** @description Field record read permission. When set to false, reading records is denied. When true or not set, reading records is allowed. */
                recordRead?: boolean;
                /** @description Field record create permission. When set to false, creating records is denied. When true or not set, creating records is allowed. */
                recordCreate?: boolean;
              })[];
          };
        };
      };
    };
    /**
     * Create field
     * @description Create a new field in the specified table with the given configuration
     */
    post: {
      parameters: {
        path: {
          tableId: string;
        };
      };
      requestBody?: {
        content: {
          "application/json": {
            /**
             * @description The field types supported by teable.
             * @example singleSelect
             * @enum {string}
             */
            type: "singleLineText" | "longText" | "user" | "attachment" | "checkbox" | "multipleSelect" | "singleSelect" | "date" | "number" | "rating" | "formula" | "rollup" | "link" | "createdTime" | "lastModifiedTime" | "createdBy" | "lastModifiedBy" | "autoNumber" | "button" | "department" | "createdByDepartment" | "lastModifiedByDepartment";
            /**
             * @description The name of the field. can not be duplicated in the table.
             * @example Tags
             */
            name?: string;
            /** @description Whether this field is not unique. */
            unique?: boolean;
            /** @description Whether this field is not null. */
            notNull?: boolean;
            /** @description Field(column) name in backend database. Limitation: 1-63 characters, can only contain letters, numbers and underscore, case sensitive, cannot be duplicated with existing db field name in the table. */
            dbFieldName?: string;
            /** @description Whether this field is lookup field. witch means cellValue and [fieldType] is looked up from the linked table. */
            isLookup?: boolean;
            /**
             * @description The description of the field.
             * @example this is a summary
             */
            description?: string | null;
            /** @description The lookup options for field, you need to configure it when isLookup attribute is true or field type is rollup. */
            lookupOptions?: {
              /** @description the table this field is linked to */
              foreignTableId: string;
              /** @description the field in the foreign table that will be displayed as the current field */
              lookupFieldId: string;
              /** @description The id of Linked record field to use for lookup */
              linkFieldId: string;
              /** @description A filter object for complex query conditions based on fields, operators, and values. Use our visual query builder at https://app.teable.ai/developer/tool/query-builder to build filters. */
              filter?: Record<string, never>;
            };
            /** @description The options of the field. The configuration of the field's options depend on the it's specific type. */
            options?: ({
              /** @enum {string} */
              expression: "countall({values})" | "counta({values})" | "count({values})" | "sum({values})" | "max({values})" | "min({values})" | "and({values})" | "or({values})" | "xor({values})" | "array_join({values})" | "array_unique({values})" | "array_compact({values})" | "concatenate({values})";
              /** @description The time zone that should be used to format dates */
              timeZone?: string;
              /** @description Different cell value types are determined based on the results of expression parsing, where numbers, dates, and formatting options are provided */
              formatting?: ({
                /** @description the display formatting of the date. you can use the following presets: M/D/YYYY, D/M/YYYY, YYYY/MM/DD, YYYY-MM-DD, YYYY-MM, MM-DD, YYYY, MM, DD */
                date: string;
                /**
                 * @description the display formatting of the time. you can use the following presets: HH:mm, hh:mm A, None
                 * @enum {string}
                 */
                time: "HH:mm" | "hh:mm A" | "None";
                /** @description The time zone that should be used to format dates */
                timeZone: string;
              }) | {
                precision: number;
                /** @enum {string} */
                type: "decimal";
              } | {
                precision: number;
                /** @enum {string} */
                type: "percent";
              } | {
                precision: number;
                /** @enum {string} */
                type: "currency";
                symbol: string;
              };
              /** @description According to the results of expression parsing to determine different visual effects, where strings, numbers will provide customized "show as" */
              showAs?: ({
                /**
                 * @description can display as url, email or phone in string field with a button to perform the corresponding action, start a phone call, send an email, or open a link in a new tab
                 * @enum {string}
                 */
                type: "url" | "email" | "phone";
              }) | ({
                /**
                 * @description can display as bar or ring in number field with single cellValue value
                 * @enum {string}
                 */
                type: "bar" | "ring";
                /** @enum {string} */
                color: "blueLight2" | "blueLight1" | "blueBright" | "blue" | "blueDark1" | "cyanLight2" | "cyanLight1" | "cyanBright" | "cyan" | "cyanDark1" | "grayLight2" | "grayLight1" | "grayBright" | "gray" | "grayDark1" | "greenLight2" | "greenLight1" | "greenBright" | "green" | "greenDark1" | "orangeLight2" | "orangeLight1" | "orangeBright" | "orange" | "orangeDark1" | "pinkLight2" | "pinkLight1" | "pinkBright" | "pink" | "pinkDark1" | "purpleLight2" | "purpleLight1" | "purpleBright" | "purple" | "purpleDark1" | "redLight2" | "redLight1" | "redBright" | "red" | "redDark1" | "tealLight2" | "tealLight1" | "tealBright" | "teal" | "tealDark1" | "yellowLight2" | "yellowLight1" | "yellowBright" | "yellow" | "yellowDark1";
                /** @description whether to displays the specific value on the graph */
                showValue: boolean;
                /** @description the value that represents a 100% maximum value, it does not represent a hard limit on the value */
                maxValue: number;
              }) | ({
                /**
                 * @description can display as bar or line in number field with multiple cellValue value
                 * @enum {string}
                 */
                type: "bar" | "line";
                /** @enum {string} */
                color: "blueLight2" | "blueLight1" | "blueBright" | "blue" | "blueDark1" | "cyanLight2" | "cyanLight1" | "cyanBright" | "cyan" | "cyanDark1" | "grayLight2" | "grayLight1" | "grayBright" | "gray" | "grayDark1" | "greenLight2" | "greenLight1" | "greenBright" | "green" | "greenDark1" | "orangeLight2" | "orangeLight1" | "orangeBright" | "orange" | "orangeDark1" | "pinkLight2" | "pinkLight1" | "pinkBright" | "pink" | "pinkDark1" | "purpleLight2" | "purpleLight1" | "purpleBright" | "purple" | "purpleDark1" | "redLight2" | "redLight1" | "redBright" | "red" | "redDark1" | "tealLight2" | "tealLight1" | "tealBright" | "teal" | "tealDark1" | "yellowLight2" | "yellowLight1" | "yellowBright" | "yellow" | "yellowDark1";
              });
            }) | ({
              /** @description The formula including fields referenced by their IDs. For example, LEFT(4, {Birthday}) input will be returned as LEFT(4, {fldXXX}) via API. The formula syntax in Teable is basically the same as Airtable */
              expression: string;
              /** @description The time zone that should be used to format dates */
              timeZone?: string;
              /** @description Different cell value types are determined based on the results of expression parsing, where numbers, dates, and formatting options are provided */
              formatting?: ({
                /** @description the display formatting of the date. you can use the following presets: M/D/YYYY, D/M/YYYY, YYYY/MM/DD, YYYY-MM-DD, YYYY-MM, MM-DD, YYYY, MM, DD */
                date: string;
                /**
                 * @description the display formatting of the time. you can use the following presets: HH:mm, hh:mm A, None
                 * @enum {string}
                 */
                time: "HH:mm" | "hh:mm A" | "None";
                /** @description The time zone that should be used to format dates */
                timeZone: string;
              }) | {
                precision: number;
                /** @enum {string} */
                type: "decimal";
              } | {
                precision: number;
                /** @enum {string} */
                type: "percent";
              } | {
                precision: number;
                /** @enum {string} */
                type: "currency";
                symbol: string;
              };
              /** @description According to the results of expression parsing to determine different visual effects, where strings, numbers will provide customized "show as" */
              showAs?: ({
                /**
                 * @description can display as url, email or phone in string field with a button to perform the corresponding action, start a phone call, send an email, or open a link in a new tab
                 * @enum {string}
                 */
                type: "url" | "email" | "phone";
              }) | ({
                /**
                 * @description can display as bar or ring in number field with single cellValue value
                 * @enum {string}
                 */
                type: "bar" | "ring";
                /** @enum {string} */
                color: "blueLight2" | "blueLight1" | "blueBright" | "blue" | "blueDark1" | "cyanLight2" | "cyanLight1" | "cyanBright" | "cyan" | "cyanDark1" | "grayLight2" | "grayLight1" | "grayBright" | "gray" | "grayDark1" | "greenLight2" | "greenLight1" | "greenBright" | "green" | "greenDark1" | "orangeLight2" | "orangeLight1" | "orangeBright" | "orange" | "orangeDark1" | "pinkLight2" | "pinkLight1" | "pinkBright" | "pink" | "pinkDark1" | "purpleLight2" | "purpleLight1" | "purpleBright" | "purple" | "purpleDark1" | "redLight2" | "redLight1" | "redBright" | "red" | "redDark1" | "tealLight2" | "tealLight1" | "tealBright" | "teal" | "tealDark1" | "yellowLight2" | "yellowLight1" | "yellowBright" | "yellow" | "yellowDark1";
                /** @description whether to displays the specific value on the graph */
                showValue: boolean;
                /** @description the value that represents a 100% maximum value, it does not represent a hard limit on the value */
                maxValue: number;
              }) | ({
                /**
                 * @description can display as bar or line in number field with multiple cellValue value
                 * @enum {string}
                 */
                type: "bar" | "line";
                /** @enum {string} */
                color: "blueLight2" | "blueLight1" | "blueBright" | "blue" | "blueDark1" | "cyanLight2" | "cyanLight1" | "cyanBright" | "cyan" | "cyanDark1" | "grayLight2" | "grayLight1" | "grayBright" | "gray" | "grayDark1" | "greenLight2" | "greenLight1" | "greenBright" | "green" | "greenDark1" | "orangeLight2" | "orangeLight1" | "orangeBright" | "orange" | "orangeDark1" | "pinkLight2" | "pinkLight1" | "pinkBright" | "pink" | "pinkDark1" | "purpleLight2" | "purpleLight1" | "purpleBright" | "purple" | "purpleDark1" | "redLight2" | "redLight1" | "redBright" | "red" | "redDark1" | "tealLight2" | "tealLight1" | "tealBright" | "teal" | "tealDark1" | "yellowLight2" | "yellowLight1" | "yellowBright" | "yellow" | "yellowDark1";
              });
            }) | ({
              /** @description the base id of the table that this field is linked to, only required for cross base link */
              baseId?: string;
              /**
               * @description describe the relationship from this table to the foreign table
               * @enum {string}
               */
              relationship: "oneOne" | "manyMany" | "oneMany" | "manyOne";
              /** @description the table this field is linked to */
              foreignTableId: string;
              /** @description the field in the foreign table that will be displayed as the current field */
              lookupFieldId: string;
              /** @description whether the field is a one-way link, when true, it will not generate a symmetric field, it is generally has better performance */
              isOneWay?: boolean;
              /** @description the table name for storing keys, in many-to-many relationships, keys are stored in a separate intermediate table; in other relationships, keys are stored on one side as needed */
              fkHostTableName: string;
              /** @description the name of the field that stores the current table primary key */
              selfKeyName: string;
              /** @description The name of the field that stores the foreign table primary key */
              foreignKeyName: string;
              /** @description the symmetric field in the foreign table, empty if the field is a one-way link */
              symmetricFieldId?: string;
              /** @description the view id that limits the number of records in the link field */
              filterByViewId?: string | null;
              /** @description the fields that will be displayed in the link field */
              visibleFieldIds?: string[] | null;
              /** @description A filter object for complex query conditions based on fields, operators, and values. Use our visual query builder at https://app.teable.ai/developer/tool/query-builder to build filters. */
              filter?: Record<string, never>;
            }) | ({
              /** @description caveat: the formatting is just a formatter, it dose not effect the storing value of the record */
              formatting: {
                /** @description the display formatting of the date. you can use the following presets: M/D/YYYY, D/M/YYYY, YYYY/MM/DD, YYYY-MM-DD, YYYY-MM, MM-DD, YYYY, MM, DD */
                date: string;
                /**
                 * @description the display formatting of the time. you can use the following presets: HH:mm, hh:mm A, None
                 * @enum {string}
                 */
                time: "HH:mm" | "hh:mm A" | "None";
                /** @description The time zone that should be used to format dates */
                timeZone: string;
              };
              /**
               * @description Whether the new row is automatically filled with the current time, caveat: the defaultValue is just a flag, it dose not effect the storing value of the record
               * @enum {string}
               */
              defaultValue?: "now";
            }) | {
              defaultValue?: boolean;
            } | Record<string, never> | ({
              /** @description Only be used in single line text field or formula / rollup field with cellValueType equals String and isMultipleCellValue is not true */
              showAs?: {
                /**
                 * @description can display as url, email or phone in string field with a button to perform the corresponding action, start a phone call, send an email, or open a link in a new tab
                 * @enum {string}
                 */
                type: "url" | "email" | "phone";
              };
              defaultValue?: string;
            }) | ({
              /** @enum {string} */
              icon: "star" | "moon" | "sun" | "zap" | "flame" | "heart" | "apple" | "thumb-up";
              /** @enum {string} */
              color: "yellowBright" | "redBright" | "tealBright";
              max: number;
            }) | ({
              /** @description Allow adding multiple users */
              isMultiple?: boolean;
              /** @description Notify users when their name is added to a cell */
              shouldNotify?: boolean;
              defaultValue?: string | "me" | ((string | "me")[]);
            }) | ({
              /** @description Button label */
              label: string;
              /**
               * @description Button color
               * @enum {string}
               */
              color: "blueLight2" | "blueLight1" | "blueBright" | "blue" | "blueDark1" | "cyanLight2" | "cyanLight1" | "cyanBright" | "cyan" | "cyanDark1" | "grayLight2" | "grayLight1" | "grayBright" | "gray" | "grayDark1" | "greenLight2" | "greenLight1" | "greenBright" | "green" | "greenDark1" | "orangeLight2" | "orangeLight1" | "orangeBright" | "orange" | "orangeDark1" | "pinkLight2" | "pinkLight1" | "pinkBright" | "pink" | "pinkDark1" | "purpleLight2" | "purpleLight1" | "purpleBright" | "purple" | "purpleDark1" | "redLight2" | "redLight1" | "redBright" | "red" | "redDark1" | "tealLight2" | "tealLight1" | "tealBright" | "teal" | "tealDark1" | "yellowLight2" | "yellowLight1" | "yellowBright" | "yellow" | "yellowDark1";
              /** @description Max count of button clicks */
              maxCount?: number;
              /** @description Reset count */
              resetCount?: boolean;
              /** @description Workflow */
              workflow?: {
                /** @description Workflow ID */
                id?: string;
                /** @description Workflow Name */
                name?: string;
                /** @description Workflow is active */
                isActive?: boolean;
              } | null;
            }) | ({
              /** @description the base id of the table that this field is linked to, only required for cross base link */
              baseId?: string;
              /**
               * @description describe the relationship from this table to the foreign table
               * @enum {string}
               */
              relationship: "oneOne" | "manyMany" | "oneMany" | "manyOne";
              /** @description the table this field is linked to */
              foreignTableId: string;
              /** @description whether the field is a one-way link, when true, it will not generate a symmetric field, it is generally has better performance */
              isOneWay?: boolean;
              /** @description the view id that limits the number of records in the link field */
              filterByViewId?: string | null;
              /** @description the fields that will be displayed in the link field */
              visibleFieldIds?: string[] | null;
              /** @description A filter object for complex query conditions based on fields, operators, and values. Use our visual query builder at https://app.teable.ai/developer/tool/query-builder to build filters. */
              filter?: Record<string, never>;
              /** @description Link field will display the value of this field from the foreign table, if not provided, it will use the primary field of the foreign table, in common case you can safely ignore it */
              lookupFieldId?: string;
            }) | ({
              choices: ({
                  id?: string;
                  name: string;
                  /** @enum {string} */
                  color?: "blueLight2" | "blueLight1" | "blueBright" | "blue" | "blueDark1" | "cyanLight2" | "cyanLight1" | "cyanBright" | "cyan" | "cyanDark1" | "grayLight2" | "grayLight1" | "grayBright" | "gray" | "grayDark1" | "greenLight2" | "greenLight1" | "greenBright" | "green" | "greenDark1" | "orangeLight2" | "orangeLight1" | "orangeBright" | "orange" | "orangeDark1" | "pinkLight2" | "pinkLight1" | "pinkBright" | "pink" | "pinkDark1" | "purpleLight2" | "purpleLight1" | "purpleBright" | "purple" | "purpleDark1" | "redLight2" | "redLight1" | "redBright" | "red" | "redDark1" | "tealLight2" | "tealLight1" | "tealBright" | "teal" | "tealDark1" | "yellowLight2" | "yellowLight1" | "yellowBright" | "yellow" | "yellowDark1";
                })[];
              defaultValue?: string | string[];
              preventAutoNewOptions?: boolean;
            }) | ({
              /** @description Only be used in number field (number field or formula / rollup field with cellValueType equals Number */
              formatting?: {
                precision: number;
                /** @enum {string} */
                type: "decimal";
              } | {
                precision: number;
                /** @enum {string} */
                type: "percent";
              } | {
                precision: number;
                /** @enum {string} */
                type: "currency";
                symbol: string;
              };
              /** @description Only be used in number field (number field or formula / rollup field with cellValueType equals Number */
              showAs?: ({
                /**
                 * @description can display as bar or ring in number field with single cellValue value
                 * @enum {string}
                 */
                type: "bar" | "ring";
                /** @enum {string} */
                color: "blueLight2" | "blueLight1" | "blueBright" | "blue" | "blueDark1" | "cyanLight2" | "cyanLight1" | "cyanBright" | "cyan" | "cyanDark1" | "grayLight2" | "grayLight1" | "grayBright" | "gray" | "grayDark1" | "greenLight2" | "greenLight1" | "greenBright" | "green" | "greenDark1" | "orangeLight2" | "orangeLight1" | "orangeBright" | "orange" | "orangeDark1" | "pinkLight2" | "pinkLight1" | "pinkBright" | "pink" | "pinkDark1" | "purpleLight2" | "purpleLight1" | "purpleBright" | "purple" | "purpleDark1" | "redLight2" | "redLight1" | "redBright" | "red" | "redDark1" | "tealLight2" | "tealLight1" | "tealBright" | "teal" | "tealDark1" | "yellowLight2" | "yellowLight1" | "yellowBright" | "yellow" | "yellowDark1";
                /** @description whether to displays the specific value on the graph */
                showValue: boolean;
                /** @description the value that represents a 100% maximum value, it does not represent a hard limit on the value */
                maxValue: number;
              }) | ({
                /**
                 * @description can display as bar or line in number field with multiple cellValue value
                 * @enum {string}
                 */
                type: "bar" | "line";
                /** @enum {string} */
                color: "blueLight2" | "blueLight1" | "blueBright" | "blue" | "blueDark1" | "cyanLight2" | "cyanLight1" | "cyanBright" | "cyan" | "cyanDark1" | "grayLight2" | "grayLight1" | "grayBright" | "gray" | "grayDark1" | "greenLight2" | "greenLight1" | "greenBright" | "green" | "greenDark1" | "orangeLight2" | "orangeLight1" | "orangeBright" | "orange" | "orangeDark1" | "pinkLight2" | "pinkLight1" | "pinkBright" | "pink" | "pinkDark1" | "purpleLight2" | "purpleLight1" | "purpleBright" | "purple" | "purpleDark1" | "redLight2" | "redLight1" | "redBright" | "red" | "redDark1" | "tealLight2" | "tealLight1" | "tealBright" | "teal" | "tealDark1" | "yellowLight2" | "yellowLight1" | "yellowBright" | "yellow" | "yellowDark1";
              });
              defaultValue?: number;
            }) | ({
              /** @description caveat: the formatting is just a formatter, it dose not effect the storing value of the record */
              formatting: {
                /** @description the display formatting of the date. you can use the following presets: M/D/YYYY, D/M/YYYY, YYYY/MM/DD, YYYY-MM-DD, YYYY-MM, MM-DD, YYYY, MM, DD */
                date: string;
                /**
                 * @description the display formatting of the time. you can use the following presets: HH:mm, hh:mm A, None
                 * @enum {string}
                 */
                time: "HH:mm" | "hh:mm A" | "None";
                /** @description The time zone that should be used to format dates */
                timeZone: string;
              };
            });
            /** @description The AI configuration of the field. */
            aiConfig?: unknown;
            /**
             * @description The id of the field that start with "fld", followed by exactly 16 alphanumeric characters `/^fld[\da-zA-Z]{16}$/`. It is sometimes useful to specify an id at creation time
             * @example fldxxxxxxxxxxxxxxxx
             */
            id?: string;
            order?: {
              /** @description You can only specify order in one view when create field */
              viewId: string;
              orderIndex: number;
            };
          };
        };
      };
      responses: {
        /** @description Returns data about a field. */
        201: {
          content: {
            "application/json": {
              /** @description The id of the field. */
              id: string;
              /**
               * @description The name of the field. can not be duplicated in the table.
               * @example Tags
               */
              name: string;
              /**
               * @description The field types supported by teable.
               * @example singleSelect
               * @enum {string}
               */
              type: "singleLineText" | "longText" | "user" | "attachment" | "checkbox" | "multipleSelect" | "singleSelect" | "date" | "number" | "rating" | "formula" | "rollup" | "link" | "createdTime" | "lastModifiedTime" | "createdBy" | "lastModifiedBy" | "autoNumber" | "button" | "department" | "createdByDepartment" | "lastModifiedByDepartment";
              /**
               * @description The description of the field.
               * @example this is a summary
               */
              description?: string;
              /** @description The configuration options of the field. The structure of the field's options depend on the field's type. */
              options: ({
                /** @enum {string} */
                expression: "countall({values})" | "counta({values})" | "count({values})" | "sum({values})" | "max({values})" | "min({values})" | "and({values})" | "or({values})" | "xor({values})" | "array_join({values})" | "array_unique({values})" | "array_compact({values})" | "concatenate({values})";
                /** @description The time zone that should be used to format dates */
                timeZone?: string;
                /** @description Different cell value types are determined based on the results of expression parsing, where numbers, dates, and formatting options are provided */
                formatting?: ({
                  /** @description the display formatting of the date. you can use the following presets: M/D/YYYY, D/M/YYYY, YYYY/MM/DD, YYYY-MM-DD, YYYY-MM, MM-DD, YYYY, MM, DD */
                  date: string;
                  /**
                   * @description the display formatting of the time. you can use the following presets: HH:mm, hh:mm A, None
                   * @enum {string}
                   */
                  time: "HH:mm" | "hh:mm A" | "None";
                  /** @description The time zone that should be used to format dates */
                  timeZone: string;
                }) | {
                  precision: number;
                  /** @enum {string} */
                  type: "decimal";
                } | {
                  precision: number;
                  /** @enum {string} */
                  type: "percent";
                } | {
                  precision: number;
                  /** @enum {string} */
                  type: "currency";
                  symbol: string;
                };
                /** @description According to the results of expression parsing to determine different visual effects, where strings, numbers will provide customized "show as" */
                showAs?: ({
                  /**
                   * @description can display as url, email or phone in string field with a button to perform the corresponding action, start a phone call, send an email, or open a link in a new tab
                   * @enum {string}
                   */
                  type: "url" | "email" | "phone";
                }) | ({
                  /**
                   * @description can display as bar or ring in number field with single cellValue value
                   * @enum {string}
                   */
                  type: "bar" | "ring";
                  /** @enum {string} */
                  color: "blueLight2" | "blueLight1" | "blueBright" | "blue" | "blueDark1" | "cyanLight2" | "cyanLight1" | "cyanBright" | "cyan" | "cyanDark1" | "grayLight2" | "grayLight1" | "grayBright" | "gray" | "grayDark1" | "greenLight2" | "greenLight1" | "greenBright" | "green" | "greenDark1" | "orangeLight2" | "orangeLight1" | "orangeBright" | "orange" | "orangeDark1" | "pinkLight2" | "pinkLight1" | "pinkBright" | "pink" | "pinkDark1" | "purpleLight2" | "purpleLight1" | "purpleBright" | "purple" | "purpleDark1" | "redLight2" | "redLight1" | "redBright" | "red" | "redDark1" | "tealLight2" | "tealLight1" | "tealBright" | "teal" | "tealDark1" | "yellowLight2" | "yellowLight1" | "yellowBright" | "yellow" | "yellowDark1";
                  /** @description whether to displays the specific value on the graph */
                  showValue: boolean;
                  /** @description the value that represents a 100% maximum value, it does not represent a hard limit on the value */
                  maxValue: number;
                }) | ({
                  /**
                   * @description can display as bar or line in number field with multiple cellValue value
                   * @enum {string}
                   */
                  type: "bar" | "line";
                  /** @enum {string} */
                  color: "blueLight2" | "blueLight1" | "blueBright" | "blue" | "blueDark1" | "cyanLight2" | "cyanLight1" | "cyanBright" | "cyan" | "cyanDark1" | "grayLight2" | "grayLight1" | "grayBright" | "gray" | "grayDark1" | "greenLight2" | "greenLight1" | "greenBright" | "green" | "greenDark1" | "orangeLight2" | "orangeLight1" | "orangeBright" | "orange" | "orangeDark1" | "pinkLight2" | "pinkLight1" | "pinkBright" | "pink" | "pinkDark1" | "purpleLight2" | "purpleLight1" | "purpleBright" | "purple" | "purpleDark1" | "redLight2" | "redLight1" | "redBright" | "red" | "redDark1" | "tealLight2" | "tealLight1" | "tealBright" | "teal" | "tealDark1" | "yellowLight2" | "yellowLight1" | "yellowBright" | "yellow" | "yellowDark1";
                });
              }) | ({
                /** @description The formula including fields referenced by their IDs. For example, LEFT(4, {Birthday}) input will be returned as LEFT(4, {fldXXX}) via API. The formula syntax in Teable is basically the same as Airtable */
                expression: string;
                /** @description The time zone that should be used to format dates */
                timeZone?: string;
                /** @description Different cell value types are determined based on the results of expression parsing, where numbers, dates, and formatting options are provided */
                formatting?: ({
                  /** @description the display formatting of the date. you can use the following presets: M/D/YYYY, D/M/YYYY, YYYY/MM/DD, YYYY-MM-DD, YYYY-MM, MM-DD, YYYY, MM, DD */
                  date: string;
                  /**
                   * @description the display formatting of the time. you can use the following presets: HH:mm, hh:mm A, None
                   * @enum {string}
                   */
                  time: "HH:mm" | "hh:mm A" | "None";
                  /** @description The time zone that should be used to format dates */
                  timeZone: string;
                }) | {
                  precision: number;
                  /** @enum {string} */
                  type: "decimal";
                } | {
                  precision: number;
                  /** @enum {string} */
                  type: "percent";
                } | {
                  precision: number;
                  /** @enum {string} */
                  type: "currency";
                  symbol: string;
                };
                /** @description According to the results of expression parsing to determine different visual effects, where strings, numbers will provide customized "show as" */
                showAs?: ({
                  /**
                   * @description can display as url, email or phone in string field with a button to perform the corresponding action, start a phone call, send an email, or open a link in a new tab
                   * @enum {string}
                   */
                  type: "url" | "email" | "phone";
                }) | ({
                  /**
                   * @description can display as bar or ring in number field with single cellValue value
                   * @enum {string}
                   */
                  type: "bar" | "ring";
                  /** @enum {string} */
                  color: "blueLight2" | "blueLight1" | "blueBright" | "blue" | "blueDark1" | "cyanLight2" | "cyanLight1" | "cyanBright" | "cyan" | "cyanDark1" | "grayLight2" | "grayLight1" | "grayBright" | "gray" | "grayDark1" | "greenLight2" | "greenLight1" | "greenBright" | "green" | "greenDark1" | "orangeLight2" | "orangeLight1" | "orangeBright" | "orange" | "orangeDark1" | "pinkLight2" | "pinkLight1" | "pinkBright" | "pink" | "pinkDark1" | "purpleLight2" | "purpleLight1" | "purpleBright" | "purple" | "purpleDark1" | "redLight2" | "redLight1" | "redBright" | "red" | "redDark1" | "tealLight2" | "tealLight1" | "tealBright" | "teal" | "tealDark1" | "yellowLight2" | "yellowLight1" | "yellowBright" | "yellow" | "yellowDark1";
                  /** @description whether to displays the specific value on the graph */
                  showValue: boolean;
                  /** @description the value that represents a 100% maximum value, it does not represent a hard limit on the value */
                  maxValue: number;
                }) | ({
                  /**
                   * @description can display as bar or line in number field with multiple cellValue value
                   * @enum {string}
                   */
                  type: "bar" | "line";
                  /** @enum {string} */
                  color: "blueLight2" | "blueLight1" | "blueBright" | "blue" | "blueDark1" | "cyanLight2" | "cyanLight1" | "cyanBright" | "cyan" | "cyanDark1" | "grayLight2" | "grayLight1" | "grayBright" | "gray" | "grayDark1" | "greenLight2" | "greenLight1" | "greenBright" | "green" | "greenDark1" | "orangeLight2" | "orangeLight1" | "orangeBright" | "orange" | "orangeDark1" | "pinkLight2" | "pinkLight1" | "pinkBright" | "pink" | "pinkDark1" | "purpleLight2" | "purpleLight1" | "purpleBright" | "purple" | "purpleDark1" | "redLight2" | "redLight1" | "redBright" | "red" | "redDark1" | "tealLight2" | "tealLight1" | "tealBright" | "teal" | "tealDark1" | "yellowLight2" | "yellowLight1" | "yellowBright" | "yellow" | "yellowDark1";
                });
              }) | ({
                /** @description the base id of the table that this field is linked to, only required for cross base link */
                baseId?: string;
                /**
                 * @description describe the relationship from this table to the foreign table
                 * @enum {string}
                 */
                relationship: "oneOne" | "manyMany" | "oneMany" | "manyOne";
                /** @description the table this field is linked to */
                foreignTableId: string;
                /** @description the field in the foreign table that will be displayed as the current field */
                lookupFieldId: string;
                /** @description whether the field is a one-way link, when true, it will not generate a symmetric field, it is generally has better performance */
                isOneWay?: boolean;
                /** @description the table name for storing keys, in many-to-many relationships, keys are stored in a separate intermediate table; in other relationships, keys are stored on one side as needed */
                fkHostTableName: string;
                /** @description the name of the field that stores the current table primary key */
                selfKeyName: string;
                /** @description The name of the field that stores the foreign table primary key */
                foreignKeyName: string;
                /** @description the symmetric field in the foreign table, empty if the field is a one-way link */
                symmetricFieldId?: string;
                /** @description the view id that limits the number of records in the link field */
                filterByViewId?: string | null;
                /** @description the fields that will be displayed in the link field */
                visibleFieldIds?: string[] | null;
                /** @description A filter object for complex query conditions based on fields, operators, and values. Use our visual query builder at https://app.teable.ai/developer/tool/query-builder to build filters. */
                filter?: Record<string, never>;
              }) | ({
                /** @description caveat: the formatting is just a formatter, it dose not effect the storing value of the record */
                formatting: {
                  /** @description the display formatting of the date. you can use the following presets: M/D/YYYY, D/M/YYYY, YYYY/MM/DD, YYYY-MM-DD, YYYY-MM, MM-DD, YYYY, MM, DD */
                  date: string;
                  /**
                   * @description the display formatting of the time. you can use the following presets: HH:mm, hh:mm A, None
                   * @enum {string}
                   */
                  time: "HH:mm" | "hh:mm A" | "None";
                  /** @description The time zone that should be used to format dates */
                  timeZone: string;
                };
                /**
                 * @description Whether the new row is automatically filled with the current time, caveat: the defaultValue is just a flag, it dose not effect the storing value of the record
                 * @enum {string}
                 */
                defaultValue?: "now";
              }) | {
                defaultValue?: boolean;
              } | Record<string, never> | ({
                /** @description Only be used in single line text field or formula / rollup field with cellValueType equals String and isMultipleCellValue is not true */
                showAs?: {
                  /**
                   * @description can display as url, email or phone in string field with a button to perform the corresponding action, start a phone call, send an email, or open a link in a new tab
                   * @enum {string}
                   */
                  type: "url" | "email" | "phone";
                };
                defaultValue?: string;
              }) | ({
                /** @enum {string} */
                icon: "star" | "moon" | "sun" | "zap" | "flame" | "heart" | "apple" | "thumb-up";
                /** @enum {string} */
                color: "yellowBright" | "redBright" | "tealBright";
                max: number;
              }) | ({
                /** @description Allow adding multiple users */
                isMultiple?: boolean;
                /** @description Notify users when their name is added to a cell */
                shouldNotify?: boolean;
                defaultValue?: string | "me" | ((string | "me")[]);
              }) | ({
                /** @description Button label */
                label: string;
                /**
                 * @description Button color
                 * @enum {string}
                 */
                color: "blueLight2" | "blueLight1" | "blueBright" | "blue" | "blueDark1" | "cyanLight2" | "cyanLight1" | "cyanBright" | "cyan" | "cyanDark1" | "grayLight2" | "grayLight1" | "grayBright" | "gray" | "grayDark1" | "greenLight2" | "greenLight1" | "greenBright" | "green" | "greenDark1" | "orangeLight2" | "orangeLight1" | "orangeBright" | "orange" | "orangeDark1" | "pinkLight2" | "pinkLight1" | "pinkBright" | "pink" | "pinkDark1" | "purpleLight2" | "purpleLight1" | "purpleBright" | "purple" | "purpleDark1" | "redLight2" | "redLight1" | "redBright" | "red" | "redDark1" | "tealLight2" | "tealLight1" | "tealBright" | "teal" | "tealDark1" | "yellowLight2" | "yellowLight1" | "yellowBright" | "yellow" | "yellowDark1";
                /** @description Max count of button clicks */
                maxCount?: number;
                /** @description Reset count */
                resetCount?: boolean;
                /** @description Workflow */
                workflow?: {
                  /** @description Workflow ID */
                  id?: string;
                  /** @description Workflow Name */
                  name?: string;
                  /** @description Workflow is active */
                  isActive?: boolean;
                } | null;
              }) | ({
                choices: ({
                    id: string;
                    name: string;
                    /** @enum {string} */
                    color: "blueLight2" | "blueLight1" | "blueBright" | "blue" | "blueDark1" | "cyanLight2" | "cyanLight1" | "cyanBright" | "cyan" | "cyanDark1" | "grayLight2" | "grayLight1" | "grayBright" | "gray" | "grayDark1" | "greenLight2" | "greenLight1" | "greenBright" | "green" | "greenDark1" | "orangeLight2" | "orangeLight1" | "orangeBright" | "orange" | "orangeDark1" | "pinkLight2" | "pinkLight1" | "pinkBright" | "pink" | "pinkDark1" | "purpleLight2" | "purpleLight1" | "purpleBright" | "purple" | "purpleDark1" | "redLight2" | "redLight1" | "redBright" | "red" | "redDark1" | "tealLight2" | "tealLight1" | "tealBright" | "teal" | "tealDark1" | "yellowLight2" | "yellowLight1" | "yellowBright" | "yellow" | "yellowDark1";
                  })[];
                defaultValue?: string | string[];
                preventAutoNewOptions?: boolean;
              }) | ({
                /** @description Only be used in number field (number field or formula / rollup field with cellValueType equals Number */
                formatting: {
                  precision: number;
                  /** @enum {string} */
                  type: "decimal";
                } | {
                  precision: number;
                  /** @enum {string} */
                  type: "percent";
                } | {
                  precision: number;
                  /** @enum {string} */
                  type: "currency";
                  symbol: string;
                };
                /** @description Only be used in number field (number field or formula / rollup field with cellValueType equals Number */
                showAs?: ({
                  /**
                   * @description can display as bar or ring in number field with single cellValue value
                   * @enum {string}
                   */
                  type: "bar" | "ring";
                  /** @enum {string} */
                  color: "blueLight2" | "blueLight1" | "blueBright" | "blue" | "blueDark1" | "cyanLight2" | "cyanLight1" | "cyanBright" | "cyan" | "cyanDark1" | "grayLight2" | "grayLight1" | "grayBright" | "gray" | "grayDark1" | "greenLight2" | "greenLight1" | "greenBright" | "green" | "greenDark1" | "orangeLight2" | "orangeLight1" | "orangeBright" | "orange" | "orangeDark1" | "pinkLight2" | "pinkLight1" | "pinkBright" | "pink" | "pinkDark1" | "purpleLight2" | "purpleLight1" | "purpleBright" | "purple" | "purpleDark1" | "redLight2" | "redLight1" | "redBright" | "red" | "redDark1" | "tealLight2" | "tealLight1" | "tealBright" | "teal" | "tealDark1" | "yellowLight2" | "yellowLight1" | "yellowBright" | "yellow" | "yellowDark1";
                  /** @description whether to displays the specific value on the graph */
                  showValue: boolean;
                  /** @description the value that represents a 100% maximum value, it does not represent a hard limit on the value */
                  maxValue: number;
                }) | ({
                  /**
                   * @description can display as bar or line in number field with multiple cellValue value
                   * @enum {string}
                   */
                  type: "bar" | "line";
                  /** @enum {string} */
                  color: "blueLight2" | "blueLight1" | "blueBright" | "blue" | "blueDark1" | "cyanLight2" | "cyanLight1" | "cyanBright" | "cyan" | "cyanDark1" | "grayLight2" | "grayLight1" | "grayBright" | "gray" | "grayDark1" | "greenLight2" | "greenLight1" | "greenBright" | "green" | "greenDark1" | "orangeLight2" | "orangeLight1" | "orangeBright" | "orange" | "orangeDark1" | "pinkLight2" | "pinkLight1" | "pinkBright" | "pink" | "pinkDark1" | "purpleLight2" | "purpleLight1" | "purpleBright" | "purple" | "purpleDark1" | "redLight2" | "redLight1" | "redBright" | "red" | "redDark1" | "tealLight2" | "tealLight1" | "tealBright" | "teal" | "tealDark1" | "yellowLight2" | "yellowLight1" | "yellowBright" | "yellow" | "yellowDark1";
                });
                defaultValue?: number;
              }) | {
                /** @enum {string} */
                expression: "AUTO_NUMBER()";
              } | ({
                /** @enum {string} */
                expression: "CREATED_TIME()";
                /** @description caveat: the formatting is just a formatter, it dose not effect the storing value of the record */
                formatting: {
                  /** @description the display formatting of the date. you can use the following presets: M/D/YYYY, D/M/YYYY, YYYY/MM/DD, YYYY-MM-DD, YYYY-MM, MM-DD, YYYY, MM, DD */
                  date: string;
                  /**
                   * @description the display formatting of the time. you can use the following presets: HH:mm, hh:mm A, None
                   * @enum {string}
                   */
                  time: "HH:mm" | "hh:mm A" | "None";
                  /** @description The time zone that should be used to format dates */
                  timeZone: string;
                };
              }) | ({
                /** @enum {string} */
                expression: "LAST_MODIFIED_TIME()";
                /** @description caveat: the formatting is just a formatter, it dose not effect the storing value of the record */
                formatting: {
                  /** @description the display formatting of the date. you can use the following presets: M/D/YYYY, D/M/YYYY, YYYY/MM/DD, YYYY-MM-DD, YYYY-MM, MM-DD, YYYY, MM, DD */
                  date: string;
                  /**
                   * @description the display formatting of the time. you can use the following presets: HH:mm, hh:mm A, None
                   * @enum {string}
                   */
                  time: "HH:mm" | "hh:mm A" | "None";
                  /** @description The time zone that should be used to format dates */
                  timeZone: string;
                };
              });
              /** @description The AI configuration of the field. */
              aiConfig?: unknown;
              /** @description Whether this field is lookup field. witch means cellValue and [fieldType] is looked up from the linked table. */
              isLookup?: boolean;
              /** @description field lookup options. */
              lookupOptions?: {
                /** @description the table this field is linked to */
                foreignTableId: string;
                /** @description the field in the foreign table that will be displayed as the current field */
                lookupFieldId: string;
                /**
                 * @description describe the relationship from this table to the foreign table
                 * @enum {string}
                 */
                relationship: "oneOne" | "manyMany" | "oneMany" | "manyOne";
                /** @description the table name for storing keys, in many-to-many relationships, keys are stored in a separate intermediate table; in other relationships, keys are stored on one side as needed */
                fkHostTableName: string;
                /** @description the name of the field that stores the current table primary key */
                selfKeyName: string;
                /** @description The name of the field that stores the foreign table primary key */
                foreignKeyName: string;
                /** @description A filter object for complex query conditions based on fields, operators, and values. Use our visual query builder at https://app.teable.ai/developer/tool/query-builder to build filters. */
                filter?: Record<string, never>;
                /** @description The id of Linked record field to use for lookup */
                linkFieldId: string;
              };
              /** @description Whether this field is not null. */
              notNull?: boolean;
              /** @description Whether this field is not unique. */
              unique?: boolean;
              /** @description Whether this field is primary field. */
              isPrimary?: boolean;
              /** @description Whether this field is computed field, you can not modify cellValue in computed field. */
              isComputed?: boolean;
              /** @description Whether this field's calculation is pending. */
              isPending?: boolean;
              /** @description Whether This field has a configuration error. Check the fields referenced by this field's formula or configuration. */
              hasError?: boolean;
              /**
               * @description The cell value type of the field.
               * @enum {string}
               */
              cellValueType: "string" | "number" | "boolean" | "dateTime";
              /** @description Whether this field has multiple cell value. */
              isMultipleCellValue?: boolean;
              /**
               * @description The field type of database that cellValue really store.
               * @enum {string}
               */
              dbFieldType: "TEXT" | "INTEGER" | "DATETIME" | "REAL" | "BLOB" | "JSON" | "BOOLEAN";
              /** @description Field(column) name in backend database. Limitation: 1-63 characters, can only contain letters, numbers and underscore, case sensitive, cannot be duplicated with existing db field name in the table. */
              dbFieldName: string;
              /** @description Field record read permission. When set to false, reading records is denied. When true or not set, reading records is allowed. */
              recordRead?: boolean;
              /** @description Field record create permission. When set to false, creating records is denied. When true or not set, creating records is allowed. */
              recordCreate?: boolean;
            };
          };
        };
      };
    };
    /**
     * Delete multiple fields
     * @description Permanently remove multiple fields from the specified table
     */
    delete: {
      parameters: {
        query: {
          fieldIds: string[];
        };
        path: {
          tableId: string;
        };
      };
      responses: {
        /** @description Deleted successfully */
        200: {
          content: never;
        };
      };
    };
  };
  "/table/{tableId}/field/{fieldId}": {
    /**
     * Get a field
     * @description Retrieve detailed information about a specific field by its ID
     */
    get: {
      parameters: {
        path: {
          tableId: string;
          fieldId: string;
        };
      };
      responses: {
        /** @description Returns data about a field. */
        200: {
          content: {
            "application/json": {
              /** @description The id of the field. */
              id: string;
              /**
               * @description The name of the field. can not be duplicated in the table.
               * @example Tags
               */
              name: string;
              /**
               * @description The field types supported by teable.
               * @example singleSelect
               * @enum {string}
               */
              type: "singleLineText" | "longText" | "user" | "attachment" | "checkbox" | "multipleSelect" | "singleSelect" | "date" | "number" | "rating" | "formula" | "rollup" | "link" | "createdTime" | "lastModifiedTime" | "createdBy" | "lastModifiedBy" | "autoNumber" | "button" | "department" | "createdByDepartment" | "lastModifiedByDepartment";
              /**
               * @description The description of the field.
               * @example this is a summary
               */
              description?: string;
              /** @description The configuration options of the field. The structure of the field's options depend on the field's type. */
              options: ({
                /** @enum {string} */
                expression: "countall({values})" | "counta({values})" | "count({values})" | "sum({values})" | "max({values})" | "min({values})" | "and({values})" | "or({values})" | "xor({values})" | "array_join({values})" | "array_unique({values})" | "array_compact({values})" | "concatenate({values})";
                /** @description The time zone that should be used to format dates */
                timeZone?: string;
                /** @description Different cell value types are determined based on the results of expression parsing, where numbers, dates, and formatting options are provided */
                formatting?: ({
                  /** @description the display formatting of the date. you can use the following presets: M/D/YYYY, D/M/YYYY, YYYY/MM/DD, YYYY-MM-DD, YYYY-MM, MM-DD, YYYY, MM, DD */
                  date: string;
                  /**
                   * @description the display formatting of the time. you can use the following presets: HH:mm, hh:mm A, None
                   * @enum {string}
                   */
                  time: "HH:mm" | "hh:mm A" | "None";
                  /** @description The time zone that should be used to format dates */
                  timeZone: string;
                }) | {
                  precision: number;
                  /** @enum {string} */
                  type: "decimal";
                } | {
                  precision: number;
                  /** @enum {string} */
                  type: "percent";
                } | {
                  precision: number;
                  /** @enum {string} */
                  type: "currency";
                  symbol: string;
                };
                /** @description According to the results of expression parsing to determine different visual effects, where strings, numbers will provide customized "show as" */
                showAs?: ({
                  /**
                   * @description can display as url, email or phone in string field with a button to perform the corresponding action, start a phone call, send an email, or open a link in a new tab
                   * @enum {string}
                   */
                  type: "url" | "email" | "phone";
                }) | ({
                  /**
                   * @description can display as bar or ring in number field with single cellValue value
                   * @enum {string}
                   */
                  type: "bar" | "ring";
                  /** @enum {string} */
                  color: "blueLight2" | "blueLight1" | "blueBright" | "blue" | "blueDark1" | "cyanLight2" | "cyanLight1" | "cyanBright" | "cyan" | "cyanDark1" | "grayLight2" | "grayLight1" | "grayBright" | "gray" | "grayDark1" | "greenLight2" | "greenLight1" | "greenBright" | "green" | "greenDark1" | "orangeLight2" | "orangeLight1" | "orangeBright" | "orange" | "orangeDark1" | "pinkLight2" | "pinkLight1" | "pinkBright" | "pink" | "pinkDark1" | "purpleLight2" | "purpleLight1" | "purpleBright" | "purple" | "purpleDark1" | "redLight2" | "redLight1" | "redBright" | "red" | "redDark1" | "tealLight2" | "tealLight1" | "tealBright" | "teal" | "tealDark1" | "yellowLight2" | "yellowLight1" | "yellowBright" | "yellow" | "yellowDark1";
                  /** @description whether to displays the specific value on the graph */
                  showValue: boolean;
                  /** @description the value that represents a 100% maximum value, it does not represent a hard limit on the value */
                  maxValue: number;
                }) | ({
                  /**
                   * @description can display as bar or line in number field with multiple cellValue value
                   * @enum {string}
                   */
                  type: "bar" | "line";
                  /** @enum {string} */
                  color: "blueLight2" | "blueLight1" | "blueBright" | "blue" | "blueDark1" | "cyanLight2" | "cyanLight1" | "cyanBright" | "cyan" | "cyanDark1" | "grayLight2" | "grayLight1" | "grayBright" | "gray" | "grayDark1" | "greenLight2" | "greenLight1" | "greenBright" | "green" | "greenDark1" | "orangeLight2" | "orangeLight1" | "orangeBright" | "orange" | "orangeDark1" | "pinkLight2" | "pinkLight1" | "pinkBright" | "pink" | "pinkDark1" | "purpleLight2" | "purpleLight1" | "purpleBright" | "purple" | "purpleDark1" | "redLight2" | "redLight1" | "redBright" | "red" | "redDark1" | "tealLight2" | "tealLight1" | "tealBright" | "teal" | "tealDark1" | "yellowLight2" | "yellowLight1" | "yellowBright" | "yellow" | "yellowDark1";
                });
              }) | ({
                /** @description The formula including fields referenced by their IDs. For example, LEFT(4, {Birthday}) input will be returned as LEFT(4, {fldXXX}) via API. The formula syntax in Teable is basically the same as Airtable */
                expression: string;
                /** @description The time zone that should be used to format dates */
                timeZone?: string;
                /** @description Different cell value types are determined based on the results of expression parsing, where numbers, dates, and formatting options are provided */
                formatting?: ({
                  /** @description the display formatting of the date. you can use the following presets: M/D/YYYY, D/M/YYYY, YYYY/MM/DD, YYYY-MM-DD, YYYY-MM, MM-DD, YYYY, MM, DD */
                  date: string;
                  /**
                   * @description the display formatting of the time. you can use the following presets: HH:mm, hh:mm A, None
                   * @enum {string}
                   */
                  time: "HH:mm" | "hh:mm A" | "None";
                  /** @description The time zone that should be used to format dates */
                  timeZone: string;
                }) | {
                  precision: number;
                  /** @enum {string} */
                  type: "decimal";
                } | {
                  precision: number;
                  /** @enum {string} */
                  type: "percent";
                } | {
                  precision: number;
                  /** @enum {string} */
                  type: "currency";
                  symbol: string;
                };
                /** @description According to the results of expression parsing to determine different visual effects, where strings, numbers will provide customized "show as" */
                showAs?: ({
                  /**
                   * @description can display as url, email or phone in string field with a button to perform the corresponding action, start a phone call, send an email, or open a link in a new tab
                   * @enum {string}
                   */
                  type: "url" | "email" | "phone";
                }) | ({
                  /**
                   * @description can display as bar or ring in number field with single cellValue value
                   * @enum {string}
                   */
                  type: "bar" | "ring";
                  /** @enum {string} */
                  color: "blueLight2" | "blueLight1" | "blueBright" | "blue" | "blueDark1" | "cyanLight2" | "cyanLight1" | "cyanBright" | "cyan" | "cyanDark1" | "grayLight2" | "grayLight1" | "grayBright" | "gray" | "grayDark1" | "greenLight2" | "greenLight1" | "greenBright" | "green" | "greenDark1" | "orangeLight2" | "orangeLight1" | "orangeBright" | "orange" | "orangeDark1" | "pinkLight2" | "pinkLight1" | "pinkBright" | "pink" | "pinkDark1" | "purpleLight2" | "purpleLight1" | "purpleBright" | "purple" | "purpleDark1" | "redLight2" | "redLight1" | "redBright" | "red" | "redDark1" | "tealLight2" | "tealLight1" | "tealBright" | "teal" | "tealDark1" | "yellowLight2" | "yellowLight1" | "yellowBright" | "yellow" | "yellowDark1";
                  /** @description whether to displays the specific value on the graph */
                  showValue: boolean;
                  /** @description the value that represents a 100% maximum value, it does not represent a hard limit on the value */
                  maxValue: number;
                }) | ({
                  /**
                   * @description can display as bar or line in number field with multiple cellValue value
                   * @enum {string}
                   */
                  type: "bar" | "line";
                  /** @enum {string} */
                  color: "blueLight2" | "blueLight1" | "blueBright" | "blue" | "blueDark1" | "cyanLight2" | "cyanLight1" | "cyanBright" | "cyan" | "cyanDark1" | "grayLight2" | "grayLight1" | "grayBright" | "gray" | "grayDark1" | "greenLight2" | "greenLight1" | "greenBright" | "green" | "greenDark1" | "orangeLight2" | "orangeLight1" | "orangeBright" | "orange" | "orangeDark1" | "pinkLight2" | "pinkLight1" | "pinkBright" | "pink" | "pinkDark1" | "purpleLight2" | "purpleLight1" | "purpleBright" | "purple" | "purpleDark1" | "redLight2" | "redLight1" | "redBright" | "red" | "redDark1" | "tealLight2" | "tealLight1" | "tealBright" | "teal" | "tealDark1" | "yellowLight2" | "yellowLight1" | "yellowBright" | "yellow" | "yellowDark1";
                });
              }) | ({
                /** @description the base id of the table that this field is linked to, only required for cross base link */
                baseId?: string;
                /**
                 * @description describe the relationship from this table to the foreign table
                 * @enum {string}
                 */
                relationship: "oneOne" | "manyMany" | "oneMany" | "manyOne";
                /** @description the table this field is linked to */
                foreignTableId: string;
                /** @description the field in the foreign table that will be displayed as the current field */
                lookupFieldId: string;
                /** @description whether the field is a one-way link, when true, it will not generate a symmetric field, it is generally has better performance */
                isOneWay?: boolean;
                /** @description the table name for storing keys, in many-to-many relationships, keys are stored in a separate intermediate table; in other relationships, keys are stored on one side as needed */
                fkHostTableName: string;
                /** @description the name of the field that stores the current table primary key */
                selfKeyName: string;
                /** @description The name of the field that stores the foreign table primary key */
                foreignKeyName: string;
                /** @description the symmetric field in the foreign table, empty if the field is a one-way link */
                symmetricFieldId?: string;
                /** @description the view id that limits the number of records in the link field */
                filterByViewId?: string | null;
                /** @description the fields that will be displayed in the link field */
                visibleFieldIds?: string[] | null;
                /** @description A filter object for complex query conditions based on fields, operators, and values. Use our visual query builder at https://app.teable.ai/developer/tool/query-builder to build filters. */
                filter?: Record<string, never>;
              }) | ({
                /** @description caveat: the formatting is just a formatter, it dose not effect the storing value of the record */
                formatting: {
                  /** @description the display formatting of the date. you can use the following presets: M/D/YYYY, D/M/YYYY, YYYY/MM/DD, YYYY-MM-DD, YYYY-MM, MM-DD, YYYY, MM, DD */
                  date: string;
                  /**
                   * @description the display formatting of the time. you can use the following presets: HH:mm, hh:mm A, None
                   * @enum {string}
                   */
                  time: "HH:mm" | "hh:mm A" | "None";
                  /** @description The time zone that should be used to format dates */
                  timeZone: string;
                };
                /**
                 * @description Whether the new row is automatically filled with the current time, caveat: the defaultValue is just a flag, it dose not effect the storing value of the record
                 * @enum {string}
                 */
                defaultValue?: "now";
              }) | {
                defaultValue?: boolean;
              } | Record<string, never> | ({
                /** @description Only be used in single line text field or formula / rollup field with cellValueType equals String and isMultipleCellValue is not true */
                showAs?: {
                  /**
                   * @description can display as url, email or phone in string field with a button to perform the corresponding action, start a phone call, send an email, or open a link in a new tab
                   * @enum {string}
                   */
                  type: "url" | "email" | "phone";
                };
                defaultValue?: string;
              }) | ({
                /** @enum {string} */
                icon: "star" | "moon" | "sun" | "zap" | "flame" | "heart" | "apple" | "thumb-up";
                /** @enum {string} */
                color: "yellowBright" | "redBright" | "tealBright";
                max: number;
              }) | ({
                /** @description Allow adding multiple users */
                isMultiple?: boolean;
                /** @description Notify users when their name is added to a cell */
                shouldNotify?: boolean;
                defaultValue?: string | "me" | ((string | "me")[]);
              }) | ({
                /** @description Button label */
                label: string;
                /**
                 * @description Button color
                 * @enum {string}
                 */
                color: "blueLight2" | "blueLight1" | "blueBright" | "blue" | "blueDark1" | "cyanLight2" | "cyanLight1" | "cyanBright" | "cyan" | "cyanDark1" | "grayLight2" | "grayLight1" | "grayBright" | "gray" | "grayDark1" | "greenLight2" | "greenLight1" | "greenBright" | "green" | "greenDark1" | "orangeLight2" | "orangeLight1" | "orangeBright" | "orange" | "orangeDark1" | "pinkLight2" | "pinkLight1" | "pinkBright" | "pink" | "pinkDark1" | "purpleLight2" | "purpleLight1" | "purpleBright" | "purple" | "purpleDark1" | "redLight2" | "redLight1" | "redBright" | "red" | "redDark1" | "tealLight2" | "tealLight1" | "tealBright" | "teal" | "tealDark1" | "yellowLight2" | "yellowLight1" | "yellowBright" | "yellow" | "yellowDark1";
                /** @description Max count of button clicks */
                maxCount?: number;
                /** @description Reset count */
                resetCount?: boolean;
                /** @description Workflow */
                workflow?: {
                  /** @description Workflow ID */
                  id?: string;
                  /** @description Workflow Name */
                  name?: string;
                  /** @description Workflow is active */
                  isActive?: boolean;
                } | null;
              }) | ({
                choices: ({
                    id: string;
                    name: string;
                    /** @enum {string} */
                    color: "blueLight2" | "blueLight1" | "blueBright" | "blue" | "blueDark1" | "cyanLight2" | "cyanLight1" | "cyanBright" | "cyan" | "cyanDark1" | "grayLight2" | "grayLight1" | "grayBright" | "gray" | "grayDark1" | "greenLight2" | "greenLight1" | "greenBright" | "green" | "greenDark1" | "orangeLight2" | "orangeLight1" | "orangeBright" | "orange" | "orangeDark1" | "pinkLight2" | "pinkLight1" | "pinkBright" | "pink" | "pinkDark1" | "purpleLight2" | "purpleLight1" | "purpleBright" | "purple" | "purpleDark1" | "redLight2" | "redLight1" | "redBright" | "red" | "redDark1" | "tealLight2" | "tealLight1" | "tealBright" | "teal" | "tealDark1" | "yellowLight2" | "yellowLight1" | "yellowBright" | "yellow" | "yellowDark1";
                  })[];
                defaultValue?: string | string[];
                preventAutoNewOptions?: boolean;
              }) | ({
                /** @description Only be used in number field (number field or formula / rollup field with cellValueType equals Number */
                formatting: {
                  precision: number;
                  /** @enum {string} */
                  type: "decimal";
                } | {
                  precision: number;
                  /** @enum {string} */
                  type: "percent";
                } | {
                  precision: number;
                  /** @enum {string} */
                  type: "currency";
                  symbol: string;
                };
                /** @description Only be used in number field (number field or formula / rollup field with cellValueType equals Number */
                showAs?: ({
                  /**
                   * @description can display as bar or ring in number field with single cellValue value
                   * @enum {string}
                   */
                  type: "bar" | "ring";
                  /** @enum {string} */
                  color: "blueLight2" | "blueLight1" | "blueBright" | "blue" | "blueDark1" | "cyanLight2" | "cyanLight1" | "cyanBright" | "cyan" | "cyanDark1" | "grayLight2" | "grayLight1" | "grayBright" | "gray" | "grayDark1" | "greenLight2" | "greenLight1" | "greenBright" | "green" | "greenDark1" | "orangeLight2" | "orangeLight1" | "orangeBright" | "orange" | "orangeDark1" | "pinkLight2" | "pinkLight1" | "pinkBright" | "pink" | "pinkDark1" | "purpleLight2" | "purpleLight1" | "purpleBright" | "purple" | "purpleDark1" | "redLight2" | "redLight1" | "redBright" | "red" | "redDark1" | "tealLight2" | "tealLight1" | "tealBright" | "teal" | "tealDark1" | "yellowLight2" | "yellowLight1" | "yellowBright" | "yellow" | "yellowDark1";
                  /** @description whether to displays the specific value on the graph */
                  showValue: boolean;
                  /** @description the value that represents a 100% maximum value, it does not represent a hard limit on the value */
                  maxValue: number;
                }) | ({
                  /**
                   * @description can display as bar or line in number field with multiple cellValue value
                   * @enum {string}
                   */
                  type: "bar" | "line";
                  /** @enum {string} */
                  color: "blueLight2" | "blueLight1" | "blueBright" | "blue" | "blueDark1" | "cyanLight2" | "cyanLight1" | "cyanBright" | "cyan" | "cyanDark1" | "grayLight2" | "grayLight1" | "grayBright" | "gray" | "grayDark1" | "greenLight2" | "greenLight1" | "greenBright" | "green" | "greenDark1" | "orangeLight2" | "orangeLight1" | "orangeBright" | "orange" | "orangeDark1" | "pinkLight2" | "pinkLight1" | "pinkBright" | "pink" | "pinkDark1" | "purpleLight2" | "purpleLight1" | "purpleBright" | "purple" | "purpleDark1" | "redLight2" | "redLight1" | "redBright" | "red" | "redDark1" | "tealLight2" | "tealLight1" | "tealBright" | "teal" | "tealDark1" | "yellowLight2" | "yellowLight1" | "yellowBright" | "yellow" | "yellowDark1";
                });
                defaultValue?: number;
              }) | {
                /** @enum {string} */
                expression: "AUTO_NUMBER()";
              } | ({
                /** @enum {string} */
                expression: "CREATED_TIME()";
                /** @description caveat: the formatting is just a formatter, it dose not effect the storing value of the record */
                formatting: {
                  /** @description the display formatting of the date. you can use the following presets: M/D/YYYY, D/M/YYYY, YYYY/MM/DD, YYYY-MM-DD, YYYY-MM, MM-DD, YYYY, MM, DD */
                  date: string;
                  /**
                   * @description the display formatting of the time. you can use the following presets: HH:mm, hh:mm A, None
                   * @enum {string}
                   */
                  time: "HH:mm" | "hh:mm A" | "None";
                  /** @description The time zone that should be used to format dates */
                  timeZone: string;
                };
              }) | ({
                /** @enum {string} */
                expression: "LAST_MODIFIED_TIME()";
                /** @description caveat: the formatting is just a formatter, it dose not effect the storing value of the record */
                formatting: {
                  /** @description the display formatting of the date. you can use the following presets: M/D/YYYY, D/M/YYYY, YYYY/MM/DD, YYYY-MM-DD, YYYY-MM, MM-DD, YYYY, MM, DD */
                  date: string;
                  /**
                   * @description the display formatting of the time. you can use the following presets: HH:mm, hh:mm A, None
                   * @enum {string}
                   */
                  time: "HH:mm" | "hh:mm A" | "None";
                  /** @description The time zone that should be used to format dates */
                  timeZone: string;
                };
              });
              /** @description The AI configuration of the field. */
              aiConfig?: unknown;
              /** @description Whether this field is lookup field. witch means cellValue and [fieldType] is looked up from the linked table. */
              isLookup?: boolean;
              /** @description field lookup options. */
              lookupOptions?: {
                /** @description the table this field is linked to */
                foreignTableId: string;
                /** @description the field in the foreign table that will be displayed as the current field */
                lookupFieldId: string;
                /**
                 * @description describe the relationship from this table to the foreign table
                 * @enum {string}
                 */
                relationship: "oneOne" | "manyMany" | "oneMany" | "manyOne";
                /** @description the table name for storing keys, in many-to-many relationships, keys are stored in a separate intermediate table; in other relationships, keys are stored on one side as needed */
                fkHostTableName: string;
                /** @description the name of the field that stores the current table primary key */
                selfKeyName: string;
                /** @description The name of the field that stores the foreign table primary key */
                foreignKeyName: string;
                /** @description A filter object for complex query conditions based on fields, operators, and values. Use our visual query builder at https://app.teable.ai/developer/tool/query-builder to build filters. */
                filter?: Record<string, never>;
                /** @description The id of Linked record field to use for lookup */
                linkFieldId: string;
              };
              /** @description Whether this field is not null. */
              notNull?: boolean;
              /** @description Whether this field is not unique. */
              unique?: boolean;
              /** @description Whether this field is primary field. */
              isPrimary?: boolean;
              /** @description Whether this field is computed field, you can not modify cellValue in computed field. */
              isComputed?: boolean;
              /** @description Whether this field's calculation is pending. */
              isPending?: boolean;
              /** @description Whether This field has a configuration error. Check the fields referenced by this field's formula or configuration. */
              hasError?: boolean;
              /**
               * @description The cell value type of the field.
               * @enum {string}
               */
              cellValueType: "string" | "number" | "boolean" | "dateTime";
              /** @description Whether this field has multiple cell value. */
              isMultipleCellValue?: boolean;
              /**
               * @description The field type of database that cellValue really store.
               * @enum {string}
               */
              dbFieldType: "TEXT" | "INTEGER" | "DATETIME" | "REAL" | "BLOB" | "JSON" | "BOOLEAN";
              /** @description Field(column) name in backend database. Limitation: 1-63 characters, can only contain letters, numbers and underscore, case sensitive, cannot be duplicated with existing db field name in the table. */
              dbFieldName: string;
              /** @description Field record read permission. When set to false, reading records is denied. When true or not set, reading records is allowed. */
              recordRead?: boolean;
              /** @description Field record create permission. When set to false, creating records is denied. When true or not set, creating records is allowed. */
              recordCreate?: boolean;
            };
          };
        };
      };
    };
    /**
     * Delete field
     * @description Permanently remove a field from the specified table
     */
    delete: {
      parameters: {
        path: {
          tableId: string;
          fieldId: string;
        };
      };
      responses: {
        /** @description Deleted successfully */
        200: {
          content: never;
        };
      };
    };
    /**
     * Update field
     * @description Update common properties of a field (name, description, dbFieldName). For other property changes, use the convert field API
     */
    patch: {
      parameters: {
        path: {
          tableId: string;
          fieldId: string;
        };
      };
      requestBody?: {
        content: {
          "application/json": {
            /**
             * @description The name of the field. can not be duplicated in the table.
             * @example Tags
             */
            name?: string;
            /**
             * @description The description of the field.
             * @example this is a summary
             */
            description?: string | null;
            /** @description Field(column) name in backend database. Limitation: 1-63 characters, can only contain letters, numbers and underscore, case sensitive, cannot be duplicated with existing db field name in the table. */
            dbFieldName?: string;
          };
        };
      };
      responses: {
        /** @description Updated Successfully */
        200: {
          content: never;
        };
      };
    };
  };
  "/table/{tableId}/field/{fieldId}/convert": {
    /**
     * Convert field type
     * @description Convert field to a different type with automatic type casting and symmetric field handling
     */
    put: {
      parameters: {
        path: {
          tableId: string;
          fieldId: string;
        };
      };
      requestBody?: {
        content: {
          "application/json": {
            /**
             * @description The field types supported by teable.
             * @example singleSelect
             * @enum {string}
             */
            type: "singleLineText" | "longText" | "user" | "attachment" | "checkbox" | "multipleSelect" | "singleSelect" | "date" | "number" | "rating" | "formula" | "rollup" | "link" | "createdTime" | "lastModifiedTime" | "createdBy" | "lastModifiedBy" | "autoNumber" | "button" | "department" | "createdByDepartment" | "lastModifiedByDepartment";
            /**
             * @description The name of the field. can not be duplicated in the table.
             * @example Tags
             */
            name?: string;
            /** @description Whether this field is not unique. */
            unique?: boolean;
            /** @description Whether this field is not null. */
            notNull?: boolean;
            /** @description Field(column) name in backend database. Limitation: 1-63 characters, can only contain letters, numbers and underscore, case sensitive, cannot be duplicated with existing db field name in the table. */
            dbFieldName?: string;
            /** @description Whether this field is lookup field. witch means cellValue and [fieldType] is looked up from the linked table. */
            isLookup?: boolean;
            /**
             * @description The description of the field.
             * @example this is a summary
             */
            description?: string | null;
            /** @description The lookup options for field, you need to configure it when isLookup attribute is true or field type is rollup. */
            lookupOptions?: {
              /** @description the table this field is linked to */
              foreignTableId: string;
              /** @description the field in the foreign table that will be displayed as the current field */
              lookupFieldId: string;
              /** @description The id of Linked record field to use for lookup */
              linkFieldId: string;
              /** @description A filter object for complex query conditions based on fields, operators, and values. Use our visual query builder at https://app.teable.ai/developer/tool/query-builder to build filters. */
              filter?: Record<string, never>;
            };
            /** @description The options of the field. The configuration of the field's options depend on the it's specific type. */
            options?: ({
              /** @enum {string} */
              expression: "countall({values})" | "counta({values})" | "count({values})" | "sum({values})" | "max({values})" | "min({values})" | "and({values})" | "or({values})" | "xor({values})" | "array_join({values})" | "array_unique({values})" | "array_compact({values})" | "concatenate({values})";
              /** @description The time zone that should be used to format dates */
              timeZone?: string;
              /** @description Different cell value types are determined based on the results of expression parsing, where numbers, dates, and formatting options are provided */
              formatting?: ({
                /** @description the display formatting of the date. you can use the following presets: M/D/YYYY, D/M/YYYY, YYYY/MM/DD, YYYY-MM-DD, YYYY-MM, MM-DD, YYYY, MM, DD */
                date: string;
                /**
                 * @description the display formatting of the time. you can use the following presets: HH:mm, hh:mm A, None
                 * @enum {string}
                 */
                time: "HH:mm" | "hh:mm A" | "None";
                /** @description The time zone that should be used to format dates */
                timeZone: string;
              }) | {
                precision: number;
                /** @enum {string} */
                type: "decimal";
              } | {
                precision: number;
                /** @enum {string} */
                type: "percent";
              } | {
                precision: number;
                /** @enum {string} */
                type: "currency";
                symbol: string;
              };
              /** @description According to the results of expression parsing to determine different visual effects, where strings, numbers will provide customized "show as" */
              showAs?: ({
                /**
                 * @description can display as url, email or phone in string field with a button to perform the corresponding action, start a phone call, send an email, or open a link in a new tab
                 * @enum {string}
                 */
                type: "url" | "email" | "phone";
              }) | ({
                /**
                 * @description can display as bar or ring in number field with single cellValue value
                 * @enum {string}
                 */
                type: "bar" | "ring";
                /** @enum {string} */
                color: "blueLight2" | "blueLight1" | "blueBright" | "blue" | "blueDark1" | "cyanLight2" | "cyanLight1" | "cyanBright" | "cyan" | "cyanDark1" | "grayLight2" | "grayLight1" | "grayBright" | "gray" | "grayDark1" | "greenLight2" | "greenLight1" | "greenBright" | "green" | "greenDark1" | "orangeLight2" | "orangeLight1" | "orangeBright" | "orange" | "orangeDark1" | "pinkLight2" | "pinkLight1" | "pinkBright" | "pink" | "pinkDark1" | "purpleLight2" | "purpleLight1" | "purpleBright" | "purple" | "purpleDark1" | "redLight2" | "redLight1" | "redBright" | "red" | "redDark1" | "tealLight2" | "tealLight1" | "tealBright" | "teal" | "tealDark1" | "yellowLight2" | "yellowLight1" | "yellowBright" | "yellow" | "yellowDark1";
                /** @description whether to displays the specific value on the graph */
                showValue: boolean;
                /** @description the value that represents a 100% maximum value, it does not represent a hard limit on the value */
                maxValue: number;
              }) | ({
                /**
                 * @description can display as bar or line in number field with multiple cellValue value
                 * @enum {string}
                 */
                type: "bar" | "line";
                /** @enum {string} */
                color: "blueLight2" | "blueLight1" | "blueBright" | "blue" | "blueDark1" | "cyanLight2" | "cyanLight1" | "cyanBright" | "cyan" | "cyanDark1" | "grayLight2" | "grayLight1" | "grayBright" | "gray" | "grayDark1" | "greenLight2" | "greenLight1" | "greenBright" | "green" | "greenDark1" | "orangeLight2" | "orangeLight1" | "orangeBright" | "orange" | "orangeDark1" | "pinkLight2" | "pinkLight1" | "pinkBright" | "pink" | "pinkDark1" | "purpleLight2" | "purpleLight1" | "purpleBright" | "purple" | "purpleDark1" | "redLight2" | "redLight1" | "redBright" | "red" | "redDark1" | "tealLight2" | "tealLight1" | "tealBright" | "teal" | "tealDark1" | "yellowLight2" | "yellowLight1" | "yellowBright" | "yellow" | "yellowDark1";
              });
            }) | ({
              /** @description The formula including fields referenced by their IDs. For example, LEFT(4, {Birthday}) input will be returned as LEFT(4, {fldXXX}) via API. The formula syntax in Teable is basically the same as Airtable */
              expression: string;
              /** @description The time zone that should be used to format dates */
              timeZone?: string;
              /** @description Different cell value types are determined based on the results of expression parsing, where numbers, dates, and formatting options are provided */
              formatting?: ({
                /** @description the display formatting of the date. you can use the following presets: M/D/YYYY, D/M/YYYY, YYYY/MM/DD, YYYY-MM-DD, YYYY-MM, MM-DD, YYYY, MM, DD */
                date: string;
                /**
                 * @description the display formatting of the time. you can use the following presets: HH:mm, hh:mm A, None
                 * @enum {string}
                 */
                time: "HH:mm" | "hh:mm A" | "None";
                /** @description The time zone that should be used to format dates */
                timeZone: string;
              }) | {
                precision: number;
                /** @enum {string} */
                type: "decimal";
              } | {
                precision: number;
                /** @enum {string} */
                type: "percent";
              } | {
                precision: number;
                /** @enum {string} */
                type: "currency";
                symbol: string;
              };
              /** @description According to the results of expression parsing to determine different visual effects, where strings, numbers will provide customized "show as" */
              showAs?: ({
                /**
                 * @description can display as url, email or phone in string field with a button to perform the corresponding action, start a phone call, send an email, or open a link in a new tab
                 * @enum {string}
                 */
                type: "url" | "email" | "phone";
              }) | ({
                /**
                 * @description can display as bar or ring in number field with single cellValue value
                 * @enum {string}
                 */
                type: "bar" | "ring";
                /** @enum {string} */
                color: "blueLight2" | "blueLight1" | "blueBright" | "blue" | "blueDark1" | "cyanLight2" | "cyanLight1" | "cyanBright" | "cyan" | "cyanDark1" | "grayLight2" | "grayLight1" | "grayBright" | "gray" | "grayDark1" | "greenLight2" | "greenLight1" | "greenBright" | "green" | "greenDark1" | "orangeLight2" | "orangeLight1" | "orangeBright" | "orange" | "orangeDark1" | "pinkLight2" | "pinkLight1" | "pinkBright" | "pink" | "pinkDark1" | "purpleLight2" | "purpleLight1" | "purpleBright" | "purple" | "purpleDark1" | "redLight2" | "redLight1" | "redBright" | "red" | "redDark1" | "tealLight2" | "tealLight1" | "tealBright" | "teal" | "tealDark1" | "yellowLight2" | "yellowLight1" | "yellowBright" | "yellow" | "yellowDark1";
                /** @description whether to displays the specific value on the graph */
                showValue: boolean;
                /** @description the value that represents a 100% maximum value, it does not represent a hard limit on the value */
                maxValue: number;
              }) | ({
                /**
                 * @description can display as bar or line in number field with multiple cellValue value
                 * @enum {string}
                 */
                type: "bar" | "line";
                /** @enum {string} */
                color: "blueLight2" | "blueLight1" | "blueBright" | "blue" | "blueDark1" | "cyanLight2" | "cyanLight1" | "cyanBright" | "cyan" | "cyanDark1" | "grayLight2" | "grayLight1" | "grayBright" | "gray" | "grayDark1" | "greenLight2" | "greenLight1" | "greenBright" | "green" | "greenDark1" | "orangeLight2" | "orangeLight1" | "orangeBright" | "orange" | "orangeDark1" | "pinkLight2" | "pinkLight1" | "pinkBright" | "pink" | "pinkDark1" | "purpleLight2" | "purpleLight1" | "purpleBright" | "purple" | "purpleDark1" | "redLight2" | "redLight1" | "redBright" | "red" | "redDark1" | "tealLight2" | "tealLight1" | "tealBright" | "teal" | "tealDark1" | "yellowLight2" | "yellowLight1" | "yellowBright" | "yellow" | "yellowDark1";
              });
            }) | ({
              /** @description the base id of the table that this field is linked to, only required for cross base link */
              baseId?: string;
              /**
               * @description describe the relationship from this table to the foreign table
               * @enum {string}
               */
              relationship: "oneOne" | "manyMany" | "oneMany" | "manyOne";
              /** @description the table this field is linked to */
              foreignTableId: string;
              /** @description the field in the foreign table that will be displayed as the current field */
              lookupFieldId: string;
              /** @description whether the field is a one-way link, when true, it will not generate a symmetric field, it is generally has better performance */
              isOneWay?: boolean;
              /** @description the table name for storing keys, in many-to-many relationships, keys are stored in a separate intermediate table; in other relationships, keys are stored on one side as needed */
              fkHostTableName: string;
              /** @description the name of the field that stores the current table primary key */
              selfKeyName: string;
              /** @description The name of the field that stores the foreign table primary key */
              foreignKeyName: string;
              /** @description the symmetric field in the foreign table, empty if the field is a one-way link */
              symmetricFieldId?: string;
              /** @description the view id that limits the number of records in the link field */
              filterByViewId?: string | null;
              /** @description the fields that will be displayed in the link field */
              visibleFieldIds?: string[] | null;
              /** @description A filter object for complex query conditions based on fields, operators, and values. Use our visual query builder at https://app.teable.ai/developer/tool/query-builder to build filters. */
              filter?: Record<string, never>;
            }) | ({
              /** @description caveat: the formatting is just a formatter, it dose not effect the storing value of the record */
              formatting: {
                /** @description the display formatting of the date. you can use the following presets: M/D/YYYY, D/M/YYYY, YYYY/MM/DD, YYYY-MM-DD, YYYY-MM, MM-DD, YYYY, MM, DD */
                date: string;
                /**
                 * @description the display formatting of the time. you can use the following presets: HH:mm, hh:mm A, None
                 * @enum {string}
                 */
                time: "HH:mm" | "hh:mm A" | "None";
                /** @description The time zone that should be used to format dates */
                timeZone: string;
              };
              /**
               * @description Whether the new row is automatically filled with the current time, caveat: the defaultValue is just a flag, it dose not effect the storing value of the record
               * @enum {string}
               */
              defaultValue?: "now";
            }) | {
              defaultValue?: boolean;
            } | Record<string, never> | ({
              /** @description Only be used in single line text field or formula / rollup field with cellValueType equals String and isMultipleCellValue is not true */
              showAs?: {
                /**
                 * @description can display as url, email or phone in string field with a button to perform the corresponding action, start a phone call, send an email, or open a link in a new tab
                 * @enum {string}
                 */
                type: "url" | "email" | "phone";
              };
              defaultValue?: string;
            }) | ({
              /** @enum {string} */
              icon: "star" | "moon" | "sun" | "zap" | "flame" | "heart" | "apple" | "thumb-up";
              /** @enum {string} */
              color: "yellowBright" | "redBright" | "tealBright";
              max: number;
            }) | ({
              /** @description Allow adding multiple users */
              isMultiple?: boolean;
              /** @description Notify users when their name is added to a cell */
              shouldNotify?: boolean;
              defaultValue?: string | "me" | ((string | "me")[]);
            }) | ({
              /** @description Button label */
              label: string;
              /**
               * @description Button color
               * @enum {string}
               */
              color: "blueLight2" | "blueLight1" | "blueBright" | "blue" | "blueDark1" | "cyanLight2" | "cyanLight1" | "cyanBright" | "cyan" | "cyanDark1" | "grayLight2" | "grayLight1" | "grayBright" | "gray" | "grayDark1" | "greenLight2" | "greenLight1" | "greenBright" | "green" | "greenDark1" | "orangeLight2" | "orangeLight1" | "orangeBright" | "orange" | "orangeDark1" | "pinkLight2" | "pinkLight1" | "pinkBright" | "pink" | "pinkDark1" | "purpleLight2" | "purpleLight1" | "purpleBright" | "purple" | "purpleDark1" | "redLight2" | "redLight1" | "redBright" | "red" | "redDark1" | "tealLight2" | "tealLight1" | "tealBright" | "teal" | "tealDark1" | "yellowLight2" | "yellowLight1" | "yellowBright" | "yellow" | "yellowDark1";
              /** @description Max count of button clicks */
              maxCount?: number;
              /** @description Reset count */
              resetCount?: boolean;
              /** @description Workflow */
              workflow?: {
                /** @description Workflow ID */
                id?: string;
                /** @description Workflow Name */
                name?: string;
                /** @description Workflow is active */
                isActive?: boolean;
              } | null;
            }) | ({
              /** @description the base id of the table that this field is linked to, only required for cross base link */
              baseId?: string;
              /**
               * @description describe the relationship from this table to the foreign table
               * @enum {string}
               */
              relationship: "oneOne" | "manyMany" | "oneMany" | "manyOne";
              /** @description the table this field is linked to */
              foreignTableId: string;
              /** @description whether the field is a one-way link, when true, it will not generate a symmetric field, it is generally has better performance */
              isOneWay?: boolean;
              /** @description the view id that limits the number of records in the link field */
              filterByViewId?: string | null;
              /** @description the fields that will be displayed in the link field */
              visibleFieldIds?: string[] | null;
              /** @description A filter object for complex query conditions based on fields, operators, and values. Use our visual query builder at https://app.teable.ai/developer/tool/query-builder to build filters. */
              filter?: Record<string, never>;
              /** @description Link field will display the value of this field from the foreign table, if not provided, it will use the primary field of the foreign table, in common case you can safely ignore it */
              lookupFieldId?: string;
            }) | ({
              choices: ({
                  id?: string;
                  name: string;
                  /** @enum {string} */
                  color?: "blueLight2" | "blueLight1" | "blueBright" | "blue" | "blueDark1" | "cyanLight2" | "cyanLight1" | "cyanBright" | "cyan" | "cyanDark1" | "grayLight2" | "grayLight1" | "grayBright" | "gray" | "grayDark1" | "greenLight2" | "greenLight1" | "greenBright" | "green" | "greenDark1" | "orangeLight2" | "orangeLight1" | "orangeBright" | "orange" | "orangeDark1" | "pinkLight2" | "pinkLight1" | "pinkBright" | "pink" | "pinkDark1" | "purpleLight2" | "purpleLight1" | "purpleBright" | "purple" | "purpleDark1" | "redLight2" | "redLight1" | "redBright" | "red" | "redDark1" | "tealLight2" | "tealLight1" | "tealBright" | "teal" | "tealDark1" | "yellowLight2" | "yellowLight1" | "yellowBright" | "yellow" | "yellowDark1";
                })[];
              defaultValue?: string | string[];
              preventAutoNewOptions?: boolean;
            }) | ({
              /** @description Only be used in number field (number field or formula / rollup field with cellValueType equals Number */
              formatting?: {
                precision: number;
                /** @enum {string} */
                type: "decimal";
              } | {
                precision: number;
                /** @enum {string} */
                type: "percent";
              } | {
                precision: number;
                /** @enum {string} */
                type: "currency";
                symbol: string;
              };
              /** @description Only be used in number field (number field or formula / rollup field with cellValueType equals Number */
              showAs?: ({
                /**
                 * @description can display as bar or ring in number field with single cellValue value
                 * @enum {string}
                 */
                type: "bar" | "ring";
                /** @enum {string} */
                color: "blueLight2" | "blueLight1" | "blueBright" | "blue" | "blueDark1" | "cyanLight2" | "cyanLight1" | "cyanBright" | "cyan" | "cyanDark1" | "grayLight2" | "grayLight1" | "grayBright" | "gray" | "grayDark1" | "greenLight2" | "greenLight1" | "greenBright" | "green" | "greenDark1" | "orangeLight2" | "orangeLight1" | "orangeBright" | "orange" | "orangeDark1" | "pinkLight2" | "pinkLight1" | "pinkBright" | "pink" | "pinkDark1" | "purpleLight2" | "purpleLight1" | "purpleBright" | "purple" | "purpleDark1" | "redLight2" | "redLight1" | "redBright" | "red" | "redDark1" | "tealLight2" | "tealLight1" | "tealBright" | "teal" | "tealDark1" | "yellowLight2" | "yellowLight1" | "yellowBright" | "yellow" | "yellowDark1";
                /** @description whether to displays the specific value on the graph */
                showValue: boolean;
                /** @description the value that represents a 100% maximum value, it does not represent a hard limit on the value */
                maxValue: number;
              }) | ({
                /**
                 * @description can display as bar or line in number field with multiple cellValue value
                 * @enum {string}
                 */
                type: "bar" | "line";
                /** @enum {string} */
                color: "blueLight2" | "blueLight1" | "blueBright" | "blue" | "blueDark1" | "cyanLight2" | "cyanLight1" | "cyanBright" | "cyan" | "cyanDark1" | "grayLight2" | "grayLight1" | "grayBright" | "gray" | "grayDark1" | "greenLight2" | "greenLight1" | "greenBright" | "green" | "greenDark1" | "orangeLight2" | "orangeLight1" | "orangeBright" | "orange" | "orangeDark1" | "pinkLight2" | "pinkLight1" | "pinkBright" | "pink" | "pinkDark1" | "purpleLight2" | "purpleLight1" | "purpleBright" | "purple" | "purpleDark1" | "redLight2" | "redLight1" | "redBright" | "red" | "redDark1" | "tealLight2" | "tealLight1" | "tealBright" | "teal" | "tealDark1" | "yellowLight2" | "yellowLight1" | "yellowBright" | "yellow" | "yellowDark1";
              });
              defaultValue?: number;
            }) | ({
              /** @description caveat: the formatting is just a formatter, it dose not effect the storing value of the record */
              formatting: {
                /** @description the display formatting of the date. you can use the following presets: M/D/YYYY, D/M/YYYY, YYYY/MM/DD, YYYY-MM-DD, YYYY-MM, MM-DD, YYYY, MM, DD */
                date: string;
                /**
                 * @description the display formatting of the time. you can use the following presets: HH:mm, hh:mm A, None
                 * @enum {string}
                 */
                time: "HH:mm" | "hh:mm A" | "None";
                /** @description The time zone that should be used to format dates */
                timeZone: string;
              };
            });
            /** @description The AI configuration of the field. */
            aiConfig?: unknown;
          };
        };
      };
      responses: {
        /** @description Returns field data after update. */
        200: {
          content: {
            "application/json": {
              /** @description The id of the field. */
              id: string;
              /**
               * @description The name of the field. can not be duplicated in the table.
               * @example Tags
               */
              name: string;
              /**
               * @description The field types supported by teable.
               * @example singleSelect
               * @enum {string}
               */
              type: "singleLineText" | "longText" | "user" | "attachment" | "checkbox" | "multipleSelect" | "singleSelect" | "date" | "number" | "rating" | "formula" | "rollup" | "link" | "createdTime" | "lastModifiedTime" | "createdBy" | "lastModifiedBy" | "autoNumber" | "button" | "department" | "createdByDepartment" | "lastModifiedByDepartment";
              /**
               * @description The description of the field.
               * @example this is a summary
               */
              description?: string;
              /** @description The configuration options of the field. The structure of the field's options depend on the field's type. */
              options: ({
                /** @enum {string} */
                expression: "countall({values})" | "counta({values})" | "count({values})" | "sum({values})" | "max({values})" | "min({values})" | "and({values})" | "or({values})" | "xor({values})" | "array_join({values})" | "array_unique({values})" | "array_compact({values})" | "concatenate({values})";
                /** @description The time zone that should be used to format dates */
                timeZone?: string;
                /** @description Different cell value types are determined based on the results of expression parsing, where numbers, dates, and formatting options are provided */
                formatting?: ({
                  /** @description the display formatting of the date. you can use the following presets: M/D/YYYY, D/M/YYYY, YYYY/MM/DD, YYYY-MM-DD, YYYY-MM, MM-DD, YYYY, MM, DD */
                  date: string;
                  /**
                   * @description the display formatting of the time. you can use the following presets: HH:mm, hh:mm A, None
                   * @enum {string}
                   */
                  time: "HH:mm" | "hh:mm A" | "None";
                  /** @description The time zone that should be used to format dates */
                  timeZone: string;
                }) | {
                  precision: number;
                  /** @enum {string} */
                  type: "decimal";
                } | {
                  precision: number;
                  /** @enum {string} */
                  type: "percent";
                } | {
                  precision: number;
                  /** @enum {string} */
                  type: "currency";
                  symbol: string;
                };
                /** @description According to the results of expression parsing to determine different visual effects, where strings, numbers will provide customized "show as" */
                showAs?: ({
                  /**
                   * @description can display as url, email or phone in string field with a button to perform the corresponding action, start a phone call, send an email, or open a link in a new tab
                   * @enum {string}
                   */
                  type: "url" | "email" | "phone";
                }) | ({
                  /**
                   * @description can display as bar or ring in number field with single cellValue value
                   * @enum {string}
                   */
                  type: "bar" | "ring";
                  /** @enum {string} */
                  color: "blueLight2" | "blueLight1" | "blueBright" | "blue" | "blueDark1" | "cyanLight2" | "cyanLight1" | "cyanBright" | "cyan" | "cyanDark1" | "grayLight2" | "grayLight1" | "grayBright" | "gray" | "grayDark1" | "greenLight2" | "greenLight1" | "greenBright" | "green" | "greenDark1" | "orangeLight2" | "orangeLight1" | "orangeBright" | "orange" | "orangeDark1" | "pinkLight2" | "pinkLight1" | "pinkBright" | "pink" | "pinkDark1" | "purpleLight2" | "purpleLight1" | "purpleBright" | "purple" | "purpleDark1" | "redLight2" | "redLight1" | "redBright" | "red" | "redDark1" | "tealLight2" | "tealLight1" | "tealBright" | "teal" | "tealDark1" | "yellowLight2" | "yellowLight1" | "yellowBright" | "yellow" | "yellowDark1";
                  /** @description whether to displays the specific value on the graph */
                  showValue: boolean;
                  /** @description the value that represents a 100% maximum value, it does not represent a hard limit on the value */
                  maxValue: number;
                }) | ({
                  /**
                   * @description can display as bar or line in number field with multiple cellValue value
                   * @enum {string}
                   */
                  type: "bar" | "line";
                  /** @enum {string} */
                  color: "blueLight2" | "blueLight1" | "blueBright" | "blue" | "blueDark1" | "cyanLight2" | "cyanLight1" | "cyanBright" | "cyan" | "cyanDark1" | "grayLight2" | "grayLight1" | "grayBright" | "gray" | "grayDark1" | "greenLight2" | "greenLight1" | "greenBright" | "green" | "greenDark1" | "orangeLight2" | "orangeLight1" | "orangeBright" | "orange" | "orangeDark1" | "pinkLight2" | "pinkLight1" | "pinkBright" | "pink" | "pinkDark1" | "purpleLight2" | "purpleLight1" | "purpleBright" | "purple" | "purpleDark1" | "redLight2" | "redLight1" | "redBright" | "red" | "redDark1" | "tealLight2" | "tealLight1" | "tealBright" | "teal" | "tealDark1" | "yellowLight2" | "yellowLight1" | "yellowBright" | "yellow" | "yellowDark1";
                });
              }) | ({
                /** @description The formula including fields referenced by their IDs. For example, LEFT(4, {Birthday}) input will be returned as LEFT(4, {fldXXX}) via API. The formula syntax in Teable is basically the same as Airtable */
                expression: string;
                /** @description The time zone that should be used to format dates */
                timeZone?: string;
                /** @description Different cell value types are determined based on the results of expression parsing, where numbers, dates, and formatting options are provided */
                formatting?: ({
                  /** @description the display formatting of the date. you can use the following presets: M/D/YYYY, D/M/YYYY, YYYY/MM/DD, YYYY-MM-DD, YYYY-MM, MM-DD, YYYY, MM, DD */
                  date: string;
                  /**
                   * @description the display formatting of the time. you can use the following presets: HH:mm, hh:mm A, None
                   * @enum {string}
                   */
                  time: "HH:mm" | "hh:mm A" | "None";
                  /** @description The time zone that should be used to format dates */
                  timeZone: string;
                }) | {
                  precision: number;
                  /** @enum {string} */
                  type: "decimal";
                } | {
                  precision: number;
                  /** @enum {string} */
                  type: "percent";
                } | {
                  precision: number;
                  /** @enum {string} */
                  type: "currency";
                  symbol: string;
                };
                /** @description According to the results of expression parsing to determine different visual effects, where strings, numbers will provide customized "show as" */
                showAs?: ({
                  /**
                   * @description can display as url, email or phone in string field with a button to perform the corresponding action, start a phone call, send an email, or open a link in a new tab
                   * @enum {string}
                   */
                  type: "url" | "email" | "phone";
                }) | ({
                  /**
                   * @description can display as bar or ring in number field with single cellValue value
                   * @enum {string}
                   */
                  type: "bar" | "ring";
                  /** @enum {string} */
                  color: "blueLight2" | "blueLight1" | "blueBright" | "blue" | "blueDark1" | "cyanLight2" | "cyanLight1" | "cyanBright" | "cyan" | "cyanDark1" | "grayLight2" | "grayLight1" | "grayBright" | "gray" | "grayDark1" | "greenLight2" | "greenLight1" | "greenBright" | "green" | "greenDark1" | "orangeLight2" | "orangeLight1" | "orangeBright" | "orange" | "orangeDark1" | "pinkLight2" | "pinkLight1" | "pinkBright" | "pink" | "pinkDark1" | "purpleLight2" | "purpleLight1" | "purpleBright" | "purple" | "purpleDark1" | "redLight2" | "redLight1" | "redBright" | "red" | "redDark1" | "tealLight2" | "tealLight1" | "tealBright" | "teal" | "tealDark1" | "yellowLight2" | "yellowLight1" | "yellowBright" | "yellow" | "yellowDark1";
                  /** @description whether to displays the specific value on the graph */
                  showValue: boolean;
                  /** @description the value that represents a 100% maximum value, it does not represent a hard limit on the value */
                  maxValue: number;
                }) | ({
                  /**
                   * @description can display as bar or line in number field with multiple cellValue value
                   * @enum {string}
                   */
                  type: "bar" | "line";
                  /** @enum {string} */
                  color: "blueLight2" | "blueLight1" | "blueBright" | "blue" | "blueDark1" | "cyanLight2" | "cyanLight1" | "cyanBright" | "cyan" | "cyanDark1" | "grayLight2" | "grayLight1" | "grayBright" | "gray" | "grayDark1" | "greenLight2" | "greenLight1" | "greenBright" | "green" | "greenDark1" | "orangeLight2" | "orangeLight1" | "orangeBright" | "orange" | "orangeDark1" | "pinkLight2" | "pinkLight1" | "pinkBright" | "pink" | "pinkDark1" | "purpleLight2" | "purpleLight1" | "purpleBright" | "purple" | "purpleDark1" | "redLight2" | "redLight1" | "redBright" | "red" | "redDark1" | "tealLight2" | "tealLight1" | "tealBright" | "teal" | "tealDark1" | "yellowLight2" | "yellowLight1" | "yellowBright" | "yellow" | "yellowDark1";
                });
              }) | ({
                /** @description the base id of the table that this field is linked to, only required for cross base link */
                baseId?: string;
                /**
                 * @description describe the relationship from this table to the foreign table
                 * @enum {string}
                 */
                relationship: "oneOne" | "manyMany" | "oneMany" | "manyOne";
                /** @description the table this field is linked to */
                foreignTableId: string;
                /** @description the field in the foreign table that will be displayed as the current field */
                lookupFieldId: string;
                /** @description whether the field is a one-way link, when true, it will not generate a symmetric field, it is generally has better performance */
                isOneWay?: boolean;
                /** @description the table name for storing keys, in many-to-many relationships, keys are stored in a separate intermediate table; in other relationships, keys are stored on one side as needed */
                fkHostTableName: string;
                /** @description the name of the field that stores the current table primary key */
                selfKeyName: string;
                /** @description The name of the field that stores the foreign table primary key */
                foreignKeyName: string;
                /** @description the symmetric field in the foreign table, empty if the field is a one-way link */
                symmetricFieldId?: string;
                /** @description the view id that limits the number of records in the link field */
                filterByViewId?: string | null;
                /** @description the fields that will be displayed in the link field */
                visibleFieldIds?: string[] | null;
                /** @description A filter object for complex query conditions based on fields, operators, and values. Use our visual query builder at https://app.teable.ai/developer/tool/query-builder to build filters. */
                filter?: Record<string, never>;
              }) | ({
                /** @description caveat: the formatting is just a formatter, it dose not effect the storing value of the record */
                formatting: {
                  /** @description the display formatting of the date. you can use the following presets: M/D/YYYY, D/M/YYYY, YYYY/MM/DD, YYYY-MM-DD, YYYY-MM, MM-DD, YYYY, MM, DD */
                  date: string;
                  /**
                   * @description the display formatting of the time. you can use the following presets: HH:mm, hh:mm A, None
                   * @enum {string}
                   */
                  time: "HH:mm" | "hh:mm A" | "None";
                  /** @description The time zone that should be used to format dates */
                  timeZone: string;
                };
                /**
                 * @description Whether the new row is automatically filled with the current time, caveat: the defaultValue is just a flag, it dose not effect the storing value of the record
                 * @enum {string}
                 */
                defaultValue?: "now";
              }) | {
                defaultValue?: boolean;
              } | Record<string, never> | ({
                /** @description Only be used in single line text field or formula / rollup field with cellValueType equals String and isMultipleCellValue is not true */
                showAs?: {
                  /**
                   * @description can display as url, email or phone in string field with a button to perform the corresponding action, start a phone call, send an email, or open a link in a new tab
                   * @enum {string}
                   */
                  type: "url" | "email" | "phone";
                };
                defaultValue?: string;
              }) | ({
                /** @enum {string} */
                icon: "star" | "moon" | "sun" | "zap" | "flame" | "heart" | "apple" | "thumb-up";
                /** @enum {string} */
                color: "yellowBright" | "redBright" | "tealBright";
                max: number;
              }) | ({
                /** @description Allow adding multiple users */
                isMultiple?: boolean;
                /** @description Notify users when their name is added to a cell */
                shouldNotify?: boolean;
                defaultValue?: string | "me" | ((string | "me")[]);
              }) | ({
                /** @description Button label */
                label: string;
                /**
                 * @description Button color
                 * @enum {string}
                 */
                color: "blueLight2" | "blueLight1" | "blueBright" | "blue" | "blueDark1" | "cyanLight2" | "cyanLight1" | "cyanBright" | "cyan" | "cyanDark1" | "grayLight2" | "grayLight1" | "grayBright" | "gray" | "grayDark1" | "greenLight2" | "greenLight1" | "greenBright" | "green" | "greenDark1" | "orangeLight2" | "orangeLight1" | "orangeBright" | "orange" | "orangeDark1" | "pinkLight2" | "pinkLight1" | "pinkBright" | "pink" | "pinkDark1" | "purpleLight2" | "purpleLight1" | "purpleBright" | "purple" | "purpleDark1" | "redLight2" | "redLight1" | "redBright" | "red" | "redDark1" | "tealLight2" | "tealLight1" | "tealBright" | "teal" | "tealDark1" | "yellowLight2" | "yellowLight1" | "yellowBright" | "yellow" | "yellowDark1";
                /** @description Max count of button clicks */
                maxCount?: number;
                /** @description Reset count */
                resetCount?: boolean;
                /** @description Workflow */
                workflow?: {
                  /** @description Workflow ID */
                  id?: string;
                  /** @description Workflow Name */
                  name?: string;
                  /** @description Workflow is active */
                  isActive?: boolean;
                } | null;
              }) | ({
                choices: ({
                    id: string;
                    name: string;
                    /** @enum {string} */
                    color: "blueLight2" | "blueLight1" | "blueBright" | "blue" | "blueDark1" | "cyanLight2" | "cyanLight1" | "cyanBright" | "cyan" | "cyanDark1" | "grayLight2" | "grayLight1" | "grayBright" | "gray" | "grayDark1" | "greenLight2" | "greenLight1" | "greenBright" | "green" | "greenDark1" | "orangeLight2" | "orangeLight1" | "orangeBright" | "orange" | "orangeDark1" | "pinkLight2" | "pinkLight1" | "pinkBright" | "pink" | "pinkDark1" | "purpleLight2" | "purpleLight1" | "purpleBright" | "purple" | "purpleDark1" | "redLight2" | "redLight1" | "redBright" | "red" | "redDark1" | "tealLight2" | "tealLight1" | "tealBright" | "teal" | "tealDark1" | "yellowLight2" | "yellowLight1" | "yellowBright" | "yellow" | "yellowDark1";
                  })[];
                defaultValue?: string | string[];
                preventAutoNewOptions?: boolean;
              }) | ({
                /** @description Only be used in number field (number field or formula / rollup field with cellValueType equals Number */
                formatting: {
                  precision: number;
                  /** @enum {string} */
                  type: "decimal";
                } | {
                  precision: number;
                  /** @enum {string} */
                  type: "percent";
                } | {
                  precision: number;
                  /** @enum {string} */
                  type: "currency";
                  symbol: string;
                };
                /** @description Only be used in number field (number field or formula / rollup field with cellValueType equals Number */
                showAs?: ({
                  /**
                   * @description can display as bar or ring in number field with single cellValue value
                   * @enum {string}
                   */
                  type: "bar" | "ring";
                  /** @enum {string} */
                  color: "blueLight2" | "blueLight1" | "blueBright" | "blue" | "blueDark1" | "cyanLight2" | "cyanLight1" | "cyanBright" | "cyan" | "cyanDark1" | "grayLight2" | "grayLight1" | "grayBright" | "gray" | "grayDark1" | "greenLight2" | "greenLight1" | "greenBright" | "green" | "greenDark1" | "orangeLight2" | "orangeLight1" | "orangeBright" | "orange" | "orangeDark1" | "pinkLight2" | "pinkLight1" | "pinkBright" | "pink" | "pinkDark1" | "purpleLight2" | "purpleLight1" | "purpleBright" | "purple" | "purpleDark1" | "redLight2" | "redLight1" | "redBright" | "red" | "redDark1" | "tealLight2" | "tealLight1" | "tealBright" | "teal" | "tealDark1" | "yellowLight2" | "yellowLight1" | "yellowBright" | "yellow" | "yellowDark1";
                  /** @description whether to displays the specific value on the graph */
                  showValue: boolean;
                  /** @description the value that represents a 100% maximum value, it does not represent a hard limit on the value */
                  maxValue: number;
                }) | ({
                  /**
                   * @description can display as bar or line in number field with multiple cellValue value
                   * @enum {string}
                   */
                  type: "bar" | "line";
                  /** @enum {string} */
                  color: "blueLight2" | "blueLight1" | "blueBright" | "blue" | "blueDark1" | "cyanLight2" | "cyanLight1" | "cyanBright" | "cyan" | "cyanDark1" | "grayLight2" | "grayLight1" | "grayBright" | "gray" | "grayDark1" | "greenLight2" | "greenLight1" | "greenBright" | "green" | "greenDark1" | "orangeLight2" | "orangeLight1" | "orangeBright" | "orange" | "orangeDark1" | "pinkLight2" | "pinkLight1" | "pinkBright" | "pink" | "pinkDark1" | "purpleLight2" | "purpleLight1" | "purpleBright" | "purple" | "purpleDark1" | "redLight2" | "redLight1" | "redBright" | "red" | "redDark1" | "tealLight2" | "tealLight1" | "tealBright" | "teal" | "tealDark1" | "yellowLight2" | "yellowLight1" | "yellowBright" | "yellow" | "yellowDark1";
                });
                defaultValue?: number;
              }) | {
                /** @enum {string} */
                expression: "AUTO_NUMBER()";
              } | ({
                /** @enum {string} */
                expression: "CREATED_TIME()";
                /** @description caveat: the formatting is just a formatter, it dose not effect the storing value of the record */
                formatting: {
                  /** @description the display formatting of the date. you can use the following presets: M/D/YYYY, D/M/YYYY, YYYY/MM/DD, YYYY-MM-DD, YYYY-MM, MM-DD, YYYY, MM, DD */
                  date: string;
                  /**
                   * @description the display formatting of the time. you can use the following presets: HH:mm, hh:mm A, None
                   * @enum {string}
                   */
                  time: "HH:mm" | "hh:mm A" | "None";
                  /** @description The time zone that should be used to format dates */
                  timeZone: string;
                };
              }) | ({
                /** @enum {string} */
                expression: "LAST_MODIFIED_TIME()";
                /** @description caveat: the formatting is just a formatter, it dose not effect the storing value of the record */
                formatting: {
                  /** @description the display formatting of the date. you can use the following presets: M/D/YYYY, D/M/YYYY, YYYY/MM/DD, YYYY-MM-DD, YYYY-MM, MM-DD, YYYY, MM, DD */
                  date: string;
                  /**
                   * @description the display formatting of the time. you can use the following presets: HH:mm, hh:mm A, None
                   * @enum {string}
                   */
                  time: "HH:mm" | "hh:mm A" | "None";
                  /** @description The time zone that should be used to format dates */
                  timeZone: string;
                };
              });
              /** @description The AI configuration of the field. */
              aiConfig?: unknown;
              /** @description Whether this field is lookup field. witch means cellValue and [fieldType] is looked up from the linked table. */
              isLookup?: boolean;
              /** @description field lookup options. */
              lookupOptions?: {
                /** @description the table this field is linked to */
                foreignTableId: string;
                /** @description the field in the foreign table that will be displayed as the current field */
                lookupFieldId: string;
                /**
                 * @description describe the relationship from this table to the foreign table
                 * @enum {string}
                 */
                relationship: "oneOne" | "manyMany" | "oneMany" | "manyOne";
                /** @description the table name for storing keys, in many-to-many relationships, keys are stored in a separate intermediate table; in other relationships, keys are stored on one side as needed */
                fkHostTableName: string;
                /** @description the name of the field that stores the current table primary key */
                selfKeyName: string;
                /** @description The name of the field that stores the foreign table primary key */
                foreignKeyName: string;
                /** @description A filter object for complex query conditions based on fields, operators, and values. Use our visual query builder at https://app.teable.ai/developer/tool/query-builder to build filters. */
                filter?: Record<string, never>;
                /** @description The id of Linked record field to use for lookup */
                linkFieldId: string;
              };
              /** @description Whether this field is not null. */
              notNull?: boolean;
              /** @description Whether this field is not unique. */
              unique?: boolean;
              /** @description Whether this field is primary field. */
              isPrimary?: boolean;
              /** @description Whether this field is computed field, you can not modify cellValue in computed field. */
              isComputed?: boolean;
              /** @description Whether this field's calculation is pending. */
              isPending?: boolean;
              /** @description Whether This field has a configuration error. Check the fields referenced by this field's formula or configuration. */
              hasError?: boolean;
              /**
               * @description The cell value type of the field.
               * @enum {string}
               */
              cellValueType: "string" | "number" | "boolean" | "dateTime";
              /** @description Whether this field has multiple cell value. */
              isMultipleCellValue?: boolean;
              /**
               * @description The field type of database that cellValue really store.
               * @enum {string}
               */
              dbFieldType: "TEXT" | "INTEGER" | "DATETIME" | "REAL" | "BLOB" | "JSON" | "BOOLEAN";
              /** @description Field(column) name in backend database. Limitation: 1-63 characters, can only contain letters, numbers and underscore, case sensitive, cannot be duplicated with existing db field name in the table. */
              dbFieldName: string;
              /** @description Field record read permission. When set to false, reading records is denied. When true or not set, reading records is allowed. */
              recordRead?: boolean;
              /** @description Field record create permission. When set to false, creating records is denied. When true or not set, creating records is allowed. */
              recordCreate?: boolean;
            };
          };
        };
      };
    };
  };
  "/table/{tableId}/view/{viewId}/filter-link-records": {
    /** @description Getting associated records for a view filter configuration. */
    get: {
      parameters: {
        path: {
          tableId: string;
          viewId: string;
        };
      };
      responses: {
        /** @description Returns the view to filter the configured records. */
        200: {
          content: {
            "application/json": {
                tableId: string;
                records: {
                    id: string;
                    title?: string;
                  }[];
              }[];
          };
        };
      };
    };
  };
  "/table/{tableId}/field/{fieldId}/filter-link-records": {
    /**
     * Get linked records for filter
     * @description Retrieve associated records that match the view filter configuration for a linked field
     */
    get: {
      parameters: {
        path: {
          tableId: string;
          viewId: string;
        };
      };
      responses: {
        /** @description Returns the link field to filter the configured records. */
        200: {
          content: {
            "application/json": {
                tableId: string;
                records: {
                    id: string;
                    title?: string;
                  }[];
              }[];
          };
        };
      };
    };
  };
  "/table/{tableId}/field/{fieldId}/auto-fill": {
    /**
     * Auto-fill a field by AI
     * @description Automatically generate suggestions for filling a specific field
     */
    post: {
      parameters: {
        path: {
          tableId: string;
          fieldId: string;
        };
      };
      requestBody?: {
        content: {
          "application/json": {
            /**
             * @description Set the view you want to fetch, default is first view. result will filter and sort by view options.
             * @example viwXXXXXXX
             */
            viewId?: string;
            /** @description A filter object for complex query conditions based on fields, operators, and values. Use our visual query builder at https://app.teable.ai/developer/tool/query-builder to build filters. */
            filter?: string;
            /** @description An array of sort objects that specifies how the records should be ordered. */
            orderBy?: string;
            /** @description An array of group objects that specifies how the records should be grouped. */
            groupBy?: string;
            /** @description When a viewId is specified, configure this to true will ignore the view's filter, sort, etc */
            ignoreViewQuery?: string | boolean;
          };
        };
      };
      responses: {
        /** @description Returns the task ID for the auto-fill process */
        200: {
          content: {
            "application/json": {
              taskId?: string | null;
            };
          };
        };
      };
    };
  };
  "/table/{tableId}/field/{fieldId}/stop-fill": {
    /**
     * Stop auto-fill a field by AI
     * @description Stop auto-fill a field by AI
     */
    post: {
      parameters: {
        path: {
          tableId: string;
          fieldId: string;
        };
      };
      responses: {
        /** @description Stop auto-fill a field by AI successfully */
        200: {
          content: never;
        };
      };
    };
  };
  "/table/{tableId}/field/{fieldId}/duplicate": {
    /**
     * Duplicate field
     * @description Duplicate field
     */
    post: {
      parameters: {
        path: {
          tableId: string;
          fieldId: string;
        };
      };
      requestBody?: {
        content: {
          "application/json": {
            name: string;
            viewId?: string;
          };
        };
      };
      responses: {
        /** @description Returns duplicated field data */
        201: {
          content: {
            "application/json": {
              /** @description The id of the field. */
              id: string;
              /**
               * @description The name of the field. can not be duplicated in the table.
               * @example Tags
               */
              name: string;
              /**
               * @description The field types supported by teable.
               * @example singleSelect
               * @enum {string}
               */
              type: "singleLineText" | "longText" | "user" | "attachment" | "checkbox" | "multipleSelect" | "singleSelect" | "date" | "number" | "rating" | "formula" | "rollup" | "link" | "createdTime" | "lastModifiedTime" | "createdBy" | "lastModifiedBy" | "autoNumber" | "button" | "department" | "createdByDepartment" | "lastModifiedByDepartment";
              /**
               * @description The description of the field.
               * @example this is a summary
               */
              description?: string;
              /** @description The configuration options of the field. The structure of the field's options depend on the field's type. */
              options: ({
                /** @enum {string} */
                expression: "countall({values})" | "counta({values})" | "count({values})" | "sum({values})" | "max({values})" | "min({values})" | "and({values})" | "or({values})" | "xor({values})" | "array_join({values})" | "array_unique({values})" | "array_compact({values})" | "concatenate({values})";
                /** @description The time zone that should be used to format dates */
                timeZone?: string;
                /** @description Different cell value types are determined based on the results of expression parsing, where numbers, dates, and formatting options are provided */
                formatting?: ({
                  /** @description the display formatting of the date. you can use the following presets: M/D/YYYY, D/M/YYYY, YYYY/MM/DD, YYYY-MM-DD, YYYY-MM, MM-DD, YYYY, MM, DD */
                  date: string;
                  /**
                   * @description the display formatting of the time. you can use the following presets: HH:mm, hh:mm A, None
                   * @enum {string}
                   */
                  time: "HH:mm" | "hh:mm A" | "None";
                  /** @description The time zone that should be used to format dates */
                  timeZone: string;
                }) | {
                  precision: number;
                  /** @enum {string} */
                  type: "decimal";
                } | {
                  precision: number;
                  /** @enum {string} */
                  type: "percent";
                } | {
                  precision: number;
                  /** @enum {string} */
                  type: "currency";
                  symbol: string;
                };
                /** @description According to the results of expression parsing to determine different visual effects, where strings, numbers will provide customized "show as" */
                showAs?: ({
                  /**
                   * @description can display as url, email or phone in string field with a button to perform the corresponding action, start a phone call, send an email, or open a link in a new tab
                   * @enum {string}
                   */
                  type: "url" | "email" | "phone";
                }) | ({
                  /**
                   * @description can display as bar or ring in number field with single cellValue value
                   * @enum {string}
                   */
                  type: "bar" | "ring";
                  /** @enum {string} */
                  color: "blueLight2" | "blueLight1" | "blueBright" | "blue" | "blueDark1" | "cyanLight2" | "cyanLight1" | "cyanBright" | "cyan" | "cyanDark1" | "grayLight2" | "grayLight1" | "grayBright" | "gray" | "grayDark1" | "greenLight2" | "greenLight1" | "greenBright" | "green" | "greenDark1" | "orangeLight2" | "orangeLight1" | "orangeBright" | "orange" | "orangeDark1" | "pinkLight2" | "pinkLight1" | "pinkBright" | "pink" | "pinkDark1" | "purpleLight2" | "purpleLight1" | "purpleBright" | "purple" | "purpleDark1" | "redLight2" | "redLight1" | "redBright" | "red" | "redDark1" | "tealLight2" | "tealLight1" | "tealBright" | "teal" | "tealDark1" | "yellowLight2" | "yellowLight1" | "yellowBright" | "yellow" | "yellowDark1";
                  /** @description whether to displays the specific value on the graph */
                  showValue: boolean;
                  /** @description the value that represents a 100% maximum value, it does not represent a hard limit on the value */
                  maxValue: number;
                }) | ({
                  /**
                   * @description can display as bar or line in number field with multiple cellValue value
                   * @enum {string}
                   */
                  type: "bar" | "line";
                  /** @enum {string} */
                  color: "blueLight2" | "blueLight1" | "blueBright" | "blue" | "blueDark1" | "cyanLight2" | "cyanLight1" | "cyanBright" | "cyan" | "cyanDark1" | "grayLight2" | "grayLight1" | "grayBright" | "gray" | "grayDark1" | "greenLight2" | "greenLight1" | "greenBright" | "green" | "greenDark1" | "orangeLight2" | "orangeLight1" | "orangeBright" | "orange" | "orangeDark1" | "pinkLight2" | "pinkLight1" | "pinkBright" | "pink" | "pinkDark1" | "purpleLight2" | "purpleLight1" | "purpleBright" | "purple" | "purpleDark1" | "redLight2" | "redLight1" | "redBright" | "red" | "redDark1" | "tealLight2" | "tealLight1" | "tealBright" | "teal" | "tealDark1" | "yellowLight2" | "yellowLight1" | "yellowBright" | "yellow" | "yellowDark1";
                });
              }) | ({
                /** @description The formula including fields referenced by their IDs. For example, LEFT(4, {Birthday}) input will be returned as LEFT(4, {fldXXX}) via API. The formula syntax in Teable is basically the same as Airtable */
                expression: string;
                /** @description The time zone that should be used to format dates */
                timeZone?: string;
                /** @description Different cell value types are determined based on the results of expression parsing, where numbers, dates, and formatting options are provided */
                formatting?: ({
                  /** @description the display formatting of the date. you can use the following presets: M/D/YYYY, D/M/YYYY, YYYY/MM/DD, YYYY-MM-DD, YYYY-MM, MM-DD, YYYY, MM, DD */
                  date: string;
                  /**
                   * @description the display formatting of the time. you can use the following presets: HH:mm, hh:mm A, None
                   * @enum {string}
                   */
                  time: "HH:mm" | "hh:mm A" | "None";
                  /** @description The time zone that should be used to format dates */
                  timeZone: string;
                }) | {
                  precision: number;
                  /** @enum {string} */
                  type: "decimal";
                } | {
                  precision: number;
                  /** @enum {string} */
                  type: "percent";
                } | {
                  precision: number;
                  /** @enum {string} */
                  type: "currency";
                  symbol: string;
                };
                /** @description According to the results of expression parsing to determine different visual effects, where strings, numbers will provide customized "show as" */
                showAs?: ({
                  /**
                   * @description can display as url, email or phone in string field with a button to perform the corresponding action, start a phone call, send an email, or open a link in a new tab
                   * @enum {string}
                   */
                  type: "url" | "email" | "phone";
                }) | ({
                  /**
                   * @description can display as bar or ring in number field with single cellValue value
                   * @enum {string}
                   */
                  type: "bar" | "ring";
                  /** @enum {string} */
                  color: "blueLight2" | "blueLight1" | "blueBright" | "blue" | "blueDark1" | "cyanLight2" | "cyanLight1" | "cyanBright" | "cyan" | "cyanDark1" | "grayLight2" | "grayLight1" | "grayBright" | "gray" | "grayDark1" | "greenLight2" | "greenLight1" | "greenBright" | "green" | "greenDark1" | "orangeLight2" | "orangeLight1" | "orangeBright" | "orange" | "orangeDark1" | "pinkLight2" | "pinkLight1" | "pinkBright" | "pink" | "pinkDark1" | "purpleLight2" | "purpleLight1" | "purpleBright" | "purple" | "purpleDark1" | "redLight2" | "redLight1" | "redBright" | "red" | "redDark1" | "tealLight2" | "tealLight1" | "tealBright" | "teal" | "tealDark1" | "yellowLight2" | "yellowLight1" | "yellowBright" | "yellow" | "yellowDark1";
                  /** @description whether to displays the specific value on the graph */
                  showValue: boolean;
                  /** @description the value that represents a 100% maximum value, it does not represent a hard limit on the value */
                  maxValue: number;
                }) | ({
                  /**
                   * @description can display as bar or line in number field with multiple cellValue value
                   * @enum {string}
                   */
                  type: "bar" | "line";
                  /** @enum {string} */
                  color: "blueLight2" | "blueLight1" | "blueBright" | "blue" | "blueDark1" | "cyanLight2" | "cyanLight1" | "cyanBright" | "cyan" | "cyanDark1" | "grayLight2" | "grayLight1" | "grayBright" | "gray" | "grayDark1" | "greenLight2" | "greenLight1" | "greenBright" | "green" | "greenDark1" | "orangeLight2" | "orangeLight1" | "orangeBright" | "orange" | "orangeDark1" | "pinkLight2" | "pinkLight1" | "pinkBright" | "pink" | "pinkDark1" | "purpleLight2" | "purpleLight1" | "purpleBright" | "purple" | "purpleDark1" | "redLight2" | "redLight1" | "redBright" | "red" | "redDark1" | "tealLight2" | "tealLight1" | "tealBright" | "teal" | "tealDark1" | "yellowLight2" | "yellowLight1" | "yellowBright" | "yellow" | "yellowDark1";
                });
              }) | ({
                /** @description the base id of the table that this field is linked to, only required for cross base link */
                baseId?: string;
                /**
                 * @description describe the relationship from this table to the foreign table
                 * @enum {string}
                 */
                relationship: "oneOne" | "manyMany" | "oneMany" | "manyOne";
                /** @description the table this field is linked to */
                foreignTableId: string;
                /** @description the field in the foreign table that will be displayed as the current field */
                lookupFieldId: string;
                /** @description whether the field is a one-way link, when true, it will not generate a symmetric field, it is generally has better performance */
                isOneWay?: boolean;
                /** @description the table name for storing keys, in many-to-many relationships, keys are stored in a separate intermediate table; in other relationships, keys are stored on one side as needed */
                fkHostTableName: string;
                /** @description the name of the field that stores the current table primary key */
                selfKeyName: string;
                /** @description The name of the field that stores the foreign table primary key */
                foreignKeyName: string;
                /** @description the symmetric field in the foreign table, empty if the field is a one-way link */
                symmetricFieldId?: string;
                /** @description the view id that limits the number of records in the link field */
                filterByViewId?: string | null;
                /** @description the fields that will be displayed in the link field */
                visibleFieldIds?: string[] | null;
                /** @description A filter object for complex query conditions based on fields, operators, and values. Use our visual query builder at https://app.teable.ai/developer/tool/query-builder to build filters. */
                filter?: Record<string, never>;
              }) | ({
                /** @description caveat: the formatting is just a formatter, it dose not effect the storing value of the record */
                formatting: {
                  /** @description the display formatting of the date. you can use the following presets: M/D/YYYY, D/M/YYYY, YYYY/MM/DD, YYYY-MM-DD, YYYY-MM, MM-DD, YYYY, MM, DD */
                  date: string;
                  /**
                   * @description the display formatting of the time. you can use the following presets: HH:mm, hh:mm A, None
                   * @enum {string}
                   */
                  time: "HH:mm" | "hh:mm A" | "None";
                  /** @description The time zone that should be used to format dates */
                  timeZone: string;
                };
                /**
                 * @description Whether the new row is automatically filled with the current time, caveat: the defaultValue is just a flag, it dose not effect the storing value of the record
                 * @enum {string}
                 */
                defaultValue?: "now";
              }) | {
                defaultValue?: boolean;
              } | Record<string, never> | ({
                /** @description Only be used in single line text field or formula / rollup field with cellValueType equals String and isMultipleCellValue is not true */
                showAs?: {
                  /**
                   * @description can display as url, email or phone in string field with a button to perform the corresponding action, start a phone call, send an email, or open a link in a new tab
                   * @enum {string}
                   */
                  type: "url" | "email" | "phone";
                };
                defaultValue?: string;
              }) | ({
                /** @enum {string} */
                icon: "star" | "moon" | "sun" | "zap" | "flame" | "heart" | "apple" | "thumb-up";
                /** @enum {string} */
                color: "yellowBright" | "redBright" | "tealBright";
                max: number;
              }) | ({
                /** @description Allow adding multiple users */
                isMultiple?: boolean;
                /** @description Notify users when their name is added to a cell */
                shouldNotify?: boolean;
                defaultValue?: string | "me" | ((string | "me")[]);
              }) | ({
                /** @description Button label */
                label: string;
                /**
                 * @description Button color
                 * @enum {string}
                 */
                color: "blueLight2" | "blueLight1" | "blueBright" | "blue" | "blueDark1" | "cyanLight2" | "cyanLight1" | "cyanBright" | "cyan" | "cyanDark1" | "grayLight2" | "grayLight1" | "grayBright" | "gray" | "grayDark1" | "greenLight2" | "greenLight1" | "greenBright" | "green" | "greenDark1" | "orangeLight2" | "orangeLight1" | "orangeBright" | "orange" | "orangeDark1" | "pinkLight2" | "pinkLight1" | "pinkBright" | "pink" | "pinkDark1" | "purpleLight2" | "purpleLight1" | "purpleBright" | "purple" | "purpleDark1" | "redLight2" | "redLight1" | "redBright" | "red" | "redDark1" | "tealLight2" | "tealLight1" | "tealBright" | "teal" | "tealDark1" | "yellowLight2" | "yellowLight1" | "yellowBright" | "yellow" | "yellowDark1";
                /** @description Max count of button clicks */
                maxCount?: number;
                /** @description Reset count */
                resetCount?: boolean;
                /** @description Workflow */
                workflow?: {
                  /** @description Workflow ID */
                  id?: string;
                  /** @description Workflow Name */
                  name?: string;
                  /** @description Workflow is active */
                  isActive?: boolean;
                } | null;
              }) | ({
                choices: ({
                    id: string;
                    name: string;
                    /** @enum {string} */
                    color: "blueLight2" | "blueLight1" | "blueBright" | "blue" | "blueDark1" | "cyanLight2" | "cyanLight1" | "cyanBright" | "cyan" | "cyanDark1" | "grayLight2" | "grayLight1" | "grayBright" | "gray" | "grayDark1" | "greenLight2" | "greenLight1" | "greenBright" | "green" | "greenDark1" | "orangeLight2" | "orangeLight1" | "orangeBright" | "orange" | "orangeDark1" | "pinkLight2" | "pinkLight1" | "pinkBright" | "pink" | "pinkDark1" | "purpleLight2" | "purpleLight1" | "purpleBright" | "purple" | "purpleDark1" | "redLight2" | "redLight1" | "redBright" | "red" | "redDark1" | "tealLight2" | "tealLight1" | "tealBright" | "teal" | "tealDark1" | "yellowLight2" | "yellowLight1" | "yellowBright" | "yellow" | "yellowDark1";
                  })[];
                defaultValue?: string | string[];
                preventAutoNewOptions?: boolean;
              }) | ({
                /** @description Only be used in number field (number field or formula / rollup field with cellValueType equals Number */
                formatting: {
                  precision: number;
                  /** @enum {string} */
                  type: "decimal";
                } | {
                  precision: number;
                  /** @enum {string} */
                  type: "percent";
                } | {
                  precision: number;
                  /** @enum {string} */
                  type: "currency";
                  symbol: string;
                };
                /** @description Only be used in number field (number field or formula / rollup field with cellValueType equals Number */
                showAs?: ({
                  /**
                   * @description can display as bar or ring in number field with single cellValue value
                   * @enum {string}
                   */
                  type: "bar" | "ring";
                  /** @enum {string} */
                  color: "blueLight2" | "blueLight1" | "blueBright" | "blue" | "blueDark1" | "cyanLight2" | "cyanLight1" | "cyanBright" | "cyan" | "cyanDark1" | "grayLight2" | "grayLight1" | "grayBright" | "gray" | "grayDark1" | "greenLight2" | "greenLight1" | "greenBright" | "green" | "greenDark1" | "orangeLight2" | "orangeLight1" | "orangeBright" | "orange" | "orangeDark1" | "pinkLight2" | "pinkLight1" | "pinkBright" | "pink" | "pinkDark1" | "purpleLight2" | "purpleLight1" | "purpleBright" | "purple" | "purpleDark1" | "redLight2" | "redLight1" | "redBright" | "red" | "redDark1" | "tealLight2" | "tealLight1" | "tealBright" | "teal" | "tealDark1" | "yellowLight2" | "yellowLight1" | "yellowBright" | "yellow" | "yellowDark1";
                  /** @description whether to displays the specific value on the graph */
                  showValue: boolean;
                  /** @description the value that represents a 100% maximum value, it does not represent a hard limit on the value */
                  maxValue: number;
                }) | ({
                  /**
                   * @description can display as bar or line in number field with multiple cellValue value
                   * @enum {string}
                   */
                  type: "bar" | "line";
                  /** @enum {string} */
                  color: "blueLight2" | "blueLight1" | "blueBright" | "blue" | "blueDark1" | "cyanLight2" | "cyanLight1" | "cyanBright" | "cyan" | "cyanDark1" | "grayLight2" | "grayLight1" | "grayBright" | "gray" | "grayDark1" | "greenLight2" | "greenLight1" | "greenBright" | "green" | "greenDark1" | "orangeLight2" | "orangeLight1" | "orangeBright" | "orange" | "orangeDark1" | "pinkLight2" | "pinkLight1" | "pinkBright" | "pink" | "pinkDark1" | "purpleLight2" | "purpleLight1" | "purpleBright" | "purple" | "purpleDark1" | "redLight2" | "redLight1" | "redBright" | "red" | "redDark1" | "tealLight2" | "tealLight1" | "tealBright" | "teal" | "tealDark1" | "yellowLight2" | "yellowLight1" | "yellowBright" | "yellow" | "yellowDark1";
                });
                defaultValue?: number;
              }) | {
                /** @enum {string} */
                expression: "AUTO_NUMBER()";
              } | ({
                /** @enum {string} */
                expression: "CREATED_TIME()";
                /** @description caveat: the formatting is just a formatter, it dose not effect the storing value of the record */
                formatting: {
                  /** @description the display formatting of the date. you can use the following presets: M/D/YYYY, D/M/YYYY, YYYY/MM/DD, YYYY-MM-DD, YYYY-MM, MM-DD, YYYY, MM, DD */
                  date: string;
                  /**
                   * @description the display formatting of the time. you can use the following presets: HH:mm, hh:mm A, None
                   * @enum {string}
                   */
                  time: "HH:mm" | "hh:mm A" | "None";
                  /** @description The time zone that should be used to format dates */
                  timeZone: string;
                };
              }) | ({
                /** @enum {string} */
                expression: "LAST_MODIFIED_TIME()";
                /** @description caveat: the formatting is just a formatter, it dose not effect the storing value of the record */
                formatting: {
                  /** @description the display formatting of the date. you can use the following presets: M/D/YYYY, D/M/YYYY, YYYY/MM/DD, YYYY-MM-DD, YYYY-MM, MM-DD, YYYY, MM, DD */
                  date: string;
                  /**
                   * @description the display formatting of the time. you can use the following presets: HH:mm, hh:mm A, None
                   * @enum {string}
                   */
                  time: "HH:mm" | "hh:mm A" | "None";
                  /** @description The time zone that should be used to format dates */
                  timeZone: string;
                };
              });
              /** @description The AI configuration of the field. */
              aiConfig?: unknown;
              /** @description Whether this field is lookup field. witch means cellValue and [fieldType] is looked up from the linked table. */
              isLookup?: boolean;
              /** @description field lookup options. */
              lookupOptions?: {
                /** @description the table this field is linked to */
                foreignTableId: string;
                /** @description the field in the foreign table that will be displayed as the current field */
                lookupFieldId: string;
                /**
                 * @description describe the relationship from this table to the foreign table
                 * @enum {string}
                 */
                relationship: "oneOne" | "manyMany" | "oneMany" | "manyOne";
                /** @description the table name for storing keys, in many-to-many relationships, keys are stored in a separate intermediate table; in other relationships, keys are stored on one side as needed */
                fkHostTableName: string;
                /** @description the name of the field that stores the current table primary key */
                selfKeyName: string;
                /** @description The name of the field that stores the foreign table primary key */
                foreignKeyName: string;
                /** @description A filter object for complex query conditions based on fields, operators, and values. Use our visual query builder at https://app.teable.ai/developer/tool/query-builder to build filters. */
                filter?: Record<string, never>;
                /** @description The id of Linked record field to use for lookup */
                linkFieldId: string;
              };
              /** @description Whether this field is not null. */
              notNull?: boolean;
              /** @description Whether this field is not unique. */
              unique?: boolean;
              /** @description Whether this field is primary field. */
              isPrimary?: boolean;
              /** @description Whether this field is computed field, you can not modify cellValue in computed field. */
              isComputed?: boolean;
              /** @description Whether this field's calculation is pending. */
              isPending?: boolean;
              /** @description Whether This field has a configuration error. Check the fields referenced by this field's formula or configuration. */
              hasError?: boolean;
              /**
               * @description The cell value type of the field.
               * @enum {string}
               */
              cellValueType: "string" | "number" | "boolean" | "dateTime";
              /** @description Whether this field has multiple cell value. */
              isMultipleCellValue?: boolean;
              /**
               * @description The field type of database that cellValue really store.
               * @enum {string}
               */
              dbFieldType: "TEXT" | "INTEGER" | "DATETIME" | "REAL" | "BLOB" | "JSON" | "BOOLEAN";
              /** @description Field(column) name in backend database. Limitation: 1-63 characters, can only contain letters, numbers and underscore, case sensitive, cannot be duplicated with existing db field name in the table. */
              dbFieldName: string;
              /** @description Field record read permission. When set to false, reading records is denied. When true or not set, reading records is allowed. */
              recordRead?: boolean;
              /** @description Field record create permission. When set to false, creating records is denied. When true or not set, creating records is allowed. */
              recordCreate?: boolean;
            };
          };
        };
      };
    };
  };
  "/table/{tableId}/view": {
    /**
     * Get view list
     * @description Get view list
     */
    get: {
      parameters: {
        path: {
          tableId: string;
        };
      };
      responses: {
        /** @description Returns the list of view. */
        200: {
          content: {
            "application/json": ({
                id: string;
                name: string;
                /** @enum {string} */
                type: "grid" | "calendar" | "kanban" | "form" | "gallery" | "plugin";
                description?: string;
                order?: number;
                options?: ({
                  /**
                   * @description The row height level of row in view
                   * @enum {string}
                   */
                  rowHeight?: "short" | "medium" | "tall" | "extraTall" | "autoFit";
                  /** @description The field name display lines in view */
                  fieldNameDisplayLines?: number;
                  /** @description The frozen column count in view */
                  frozenColumnCount?: number;
                }) | ({
                  /** @description The field id of the Kanban stack. */
                  stackFieldId?: string;
                  /** @description The cover field id is a designated attachment field id, the contents of which appear at the top of each Kanban card. */
                  coverFieldId?: string | null;
                  /** @description If true, cover images are resized to fit Kanban cards. */
                  isCoverFit?: boolean;
                  /** @description If true, hides field name in the Kanban cards. */
                  isFieldNameHidden?: boolean;
                  /** @description If true, hides empty stacks in the Kanban. */
                  isEmptyStackHidden?: boolean;
                }) | ({
                  /** @description The cover field id is a designated attachment field id, the contents of which appear at the top of each gallery card. */
                  coverFieldId?: string | null;
                  /** @description If true, cover images are resized to fit gallery cards. */
                  isCoverFit?: boolean;
                  /** @description If true, hides field name in the gallery cards. */
                  isFieldNameHidden?: boolean;
                }) | ({
                  /** @description The start date field id. */
                  startDateFieldId?: string | null;
                  /** @description The end date field id. */
                  endDateFieldId?: string | null;
                  /** @description The title field id. */
                  titleFieldId?: string | null;
                  colorConfig?: ({
                    /** @enum {string} */
                    type: "field" | "custom";
                    /** @description The color field id. */
                    fieldId?: string | null;
                    /**
                     * @description The color.
                     * @enum {string|null}
                     */
                    color?: "blueLight2" | "blueLight1" | "blueBright" | "blue" | "blueDark1" | "cyanLight2" | "cyanLight1" | "cyanBright" | "cyan" | "cyanDark1" | "grayLight2" | "grayLight1" | "grayBright" | "gray" | "grayDark1" | "greenLight2" | "greenLight1" | "greenBright" | "green" | "greenDark1" | "orangeLight2" | "orangeLight1" | "orangeBright" | "orange" | "orangeDark1" | "pinkLight2" | "pinkLight1" | "pinkBright" | "pink" | "pinkDark1" | "purpleLight2" | "purpleLight1" | "purpleBright" | "purple" | "purpleDark1" | "redLight2" | "redLight1" | "redBright" | "red" | "redDark1" | "tealLight2" | "tealLight1" | "tealBright" | "teal" | "tealDark1" | "yellowLight2" | "yellowLight1" | "yellowBright" | "yellow" | "yellowDark1" | null;
                  }) | null;
                }) | {
                  /** @description The cover url of the form */
                  coverUrl?: string;
                  /** @description The logo url of the form */
                  logoUrl?: string;
                  /** @description The submit button text of the form */
                  submitLabel?: string;
                } | {
                  /** @description The plugin id */
                  pluginId: string;
                  /** @description The plugin install id */
                  pluginInstallId: string;
                  /** @description The plugin logo */
                  pluginLogo: string;
                };
                sort?: ({
                  sortObjs: ({
                      /** @description The id of the field. */
                      fieldId: string;
                      /** @enum {string} */
                      order: "asc" | "desc";
                    })[];
                  manualSort?: boolean;
                }) | null;
                /** @description A filter object for complex query conditions based on fields, operators, and values. Use our visual query builder at https://app.teable.ai/developer/tool/query-builder to build filters. */
                filter?: Record<string, never>;
                group?: (({
                    /** @description The id of the field. */
                    fieldId: string;
                    /** @enum {string} */
                    order: "asc" | "desc";
                  })[]) | null;
                isLocked?: boolean;
                shareId?: string;
                enableShare?: boolean;
                shareMeta?: {
                  allowCopy?: boolean;
                  includeHiddenField?: boolean;
                  password?: string;
                  includeRecords?: boolean;
                  submit?: {
                    allow?: boolean;
                    requireLogin?: boolean;
                  };
                };
                createdBy: string;
                lastModifiedBy?: string;
                createdTime: string;
                lastModifiedTime?: string;
                /** @description A mapping of view IDs to their corresponding column metadata. */
                columnMeta: {
                  [key: string]: ({
                    /** @description Order is a floating number, column will sort by it in the view. */
                    order: number;
                    /** @description Column width in the view. */
                    width?: number;
                    /** @description If column hidden in the view. */
                    hidden?: boolean;
                    /**
                     * @description Statistic function of the column in the view.
                     * @enum {string|null}
                     */
                    statisticFunc?: "count" | "empty" | "filled" | "unique" | "max" | "min" | "sum" | "average" | "checked" | "unChecked" | "percentEmpty" | "percentFilled" | "percentUnique" | "percentChecked" | "percentUnChecked" | "earliestDate" | "latestDate" | "dateRangeOfDays" | "dateRangeOfMonths" | "totalAttachmentSize" | null;
                  }) | {
                    /** @description Order is a floating number, column will sort by it in the view. */
                    order: number;
                    /** @description If column visible in the kanban view. */
                    visible?: boolean;
                  } | {
                    /** @description Order is a floating number, column will sort by it in the view. */
                    order: number;
                    /** @description If column visible in the gallery view. */
                    visible?: boolean;
                  } | {
                    /** @description Order is a floating number, column will sort by it in the view. */
                    order: number;
                    /** @description If column visible in the view. */
                    visible?: boolean;
                    /** @description If column is required. */
                    required?: boolean;
                  } | {
                    /** @description Order is a floating number, column will sort by it in the view. */
                    order: number;
                    /** @description If column hidden in the view. */
                    hidden?: boolean;
                  };
                };
                pluginId?: string;
              })[];
          };
        };
      };
    };
    /** @description Create a view */
    post: {
      parameters: {
        path: {
          tableId: string;
        };
      };
      requestBody?: {
        content: {
          "application/json": {
            name?: string;
            /** @enum {string} */
            type: "grid" | "calendar" | "kanban" | "form" | "gallery" | "plugin";
            description?: string;
            order?: number;
            options?: ({
              /**
               * @description The row height level of row in view
               * @enum {string}
               */
              rowHeight?: "short" | "medium" | "tall" | "extraTall" | "autoFit";
              /** @description The field name display lines in view */
              fieldNameDisplayLines?: number;
              /** @description The frozen column count in view */
              frozenColumnCount?: number;
            }) | ({
              /** @description The field id of the Kanban stack. */
              stackFieldId?: string;
              /** @description The cover field id is a designated attachment field id, the contents of which appear at the top of each Kanban card. */
              coverFieldId?: string | null;
              /** @description If true, cover images are resized to fit Kanban cards. */
              isCoverFit?: boolean;
              /** @description If true, hides field name in the Kanban cards. */
              isFieldNameHidden?: boolean;
              /** @description If true, hides empty stacks in the Kanban. */
              isEmptyStackHidden?: boolean;
            }) | ({
              /** @description The cover field id is a designated attachment field id, the contents of which appear at the top of each gallery card. */
              coverFieldId?: string | null;
              /** @description If true, cover images are resized to fit gallery cards. */
              isCoverFit?: boolean;
              /** @description If true, hides field name in the gallery cards. */
              isFieldNameHidden?: boolean;
            }) | ({
              /** @description The start date field id. */
              startDateFieldId?: string | null;
              /** @description The end date field id. */
              endDateFieldId?: string | null;
              /** @description The title field id. */
              titleFieldId?: string | null;
              colorConfig?: ({
                /** @enum {string} */
                type: "field" | "custom";
                /** @description The color field id. */
                fieldId?: string | null;
                /**
                 * @description The color.
                 * @enum {string|null}
                 */
                color?: "blueLight2" | "blueLight1" | "blueBright" | "blue" | "blueDark1" | "cyanLight2" | "cyanLight1" | "cyanBright" | "cyan" | "cyanDark1" | "grayLight2" | "grayLight1" | "grayBright" | "gray" | "grayDark1" | "greenLight2" | "greenLight1" | "greenBright" | "green" | "greenDark1" | "orangeLight2" | "orangeLight1" | "orangeBright" | "orange" | "orangeDark1" | "pinkLight2" | "pinkLight1" | "pinkBright" | "pink" | "pinkDark1" | "purpleLight2" | "purpleLight1" | "purpleBright" | "purple" | "purpleDark1" | "redLight2" | "redLight1" | "redBright" | "red" | "redDark1" | "tealLight2" | "tealLight1" | "tealBright" | "teal" | "tealDark1" | "yellowLight2" | "yellowLight1" | "yellowBright" | "yellow" | "yellowDark1" | null;
              }) | null;
            }) | {
              /** @description The cover url of the form */
              coverUrl?: string;
              /** @description The logo url of the form */
              logoUrl?: string;
              /** @description The submit button text of the form */
              submitLabel?: string;
            } | {
              /** @description The plugin id */
              pluginId: string;
              /** @description The plugin install id */
              pluginInstallId: string;
              /** @description The plugin logo */
              pluginLogo: string;
            };
            sort?: ({
              sortObjs: ({
                  /** @description The id of the field. */
                  fieldId: string;
                  /** @enum {string} */
                  order: "asc" | "desc";
                })[];
              manualSort?: boolean;
            }) | null;
            /** @description A filter object for complex query conditions based on fields, operators, and values. Use our visual query builder at https://app.teable.ai/developer/tool/query-builder to build filters. */
            filter?: Record<string, never>;
            group?: (({
                /** @description The id of the field. */
                fieldId: string;
                /** @enum {string} */
                order: "asc" | "desc";
              })[]) | null;
            isLocked?: boolean;
            shareId?: string;
            enableShare?: boolean;
            shareMeta?: {
              allowCopy?: boolean;
              includeHiddenField?: boolean;
              password?: string;
              includeRecords?: boolean;
              submit?: {
                allow?: boolean;
                requireLogin?: boolean;
              };
            };
            /** @description A mapping of view IDs to their corresponding column metadata. */
            columnMeta?: {
              [key: string]: ({
                /** @description Order is a floating number, column will sort by it in the view. */
                order: number;
                /** @description Column width in the view. */
                width?: number;
                /** @description If column hidden in the view. */
                hidden?: boolean;
                /**
                 * @description Statistic function of the column in the view.
                 * @enum {string|null}
                 */
                statisticFunc?: "count" | "empty" | "filled" | "unique" | "max" | "min" | "sum" | "average" | "checked" | "unChecked" | "percentEmpty" | "percentFilled" | "percentUnique" | "percentChecked" | "percentUnChecked" | "earliestDate" | "latestDate" | "dateRangeOfDays" | "dateRangeOfMonths" | "totalAttachmentSize" | null;
              }) | {
                /** @description Order is a floating number, column will sort by it in the view. */
                order: number;
                /** @description If column visible in the kanban view. */
                visible?: boolean;
              } | {
                /** @description Order is a floating number, column will sort by it in the view. */
                order: number;
                /** @description If column visible in the gallery view. */
                visible?: boolean;
              } | {
                /** @description Order is a floating number, column will sort by it in the view. */
                order: number;
                /** @description If column visible in the view. */
                visible?: boolean;
                /** @description If column is required. */
                required?: boolean;
              } | {
                /** @description Order is a floating number, column will sort by it in the view. */
                order: number;
                /** @description If column hidden in the view. */
                hidden?: boolean;
              };
            };
          };
        };
      };
      responses: {
        /** @description Returns data about a view. */
        201: {
          content: {
            "application/json": {
              id: string;
              name: string;
              /** @enum {string} */
              type: "grid" | "calendar" | "kanban" | "form" | "gallery" | "plugin";
              description?: string;
              order?: number;
              options?: ({
                /**
                 * @description The row height level of row in view
                 * @enum {string}
                 */
                rowHeight?: "short" | "medium" | "tall" | "extraTall" | "autoFit";
                /** @description The field name display lines in view */
                fieldNameDisplayLines?: number;
                /** @description The frozen column count in view */
                frozenColumnCount?: number;
              }) | ({
                /** @description The field id of the Kanban stack. */
                stackFieldId?: string;
                /** @description The cover field id is a designated attachment field id, the contents of which appear at the top of each Kanban card. */
                coverFieldId?: string | null;
                /** @description If true, cover images are resized to fit Kanban cards. */
                isCoverFit?: boolean;
                /** @description If true, hides field name in the Kanban cards. */
                isFieldNameHidden?: boolean;
                /** @description If true, hides empty stacks in the Kanban. */
                isEmptyStackHidden?: boolean;
              }) | ({
                /** @description The cover field id is a designated attachment field id, the contents of which appear at the top of each gallery card. */
                coverFieldId?: string | null;
                /** @description If true, cover images are resized to fit gallery cards. */
                isCoverFit?: boolean;
                /** @description If true, hides field name in the gallery cards. */
                isFieldNameHidden?: boolean;
              }) | ({
                /** @description The start date field id. */
                startDateFieldId?: string | null;
                /** @description The end date field id. */
                endDateFieldId?: string | null;
                /** @description The title field id. */
                titleFieldId?: string | null;
                colorConfig?: ({
                  /** @enum {string} */
                  type: "field" | "custom";
                  /** @description The color field id. */
                  fieldId?: string | null;
                  /**
                   * @description The color.
                   * @enum {string|null}
                   */
                  color?: "blueLight2" | "blueLight1" | "blueBright" | "blue" | "blueDark1" | "cyanLight2" | "cyanLight1" | "cyanBright" | "cyan" | "cyanDark1" | "grayLight2" | "grayLight1" | "grayBright" | "gray" | "grayDark1" | "greenLight2" | "greenLight1" | "greenBright" | "green" | "greenDark1" | "orangeLight2" | "orangeLight1" | "orangeBright" | "orange" | "orangeDark1" | "pinkLight2" | "pinkLight1" | "pinkBright" | "pink" | "pinkDark1" | "purpleLight2" | "purpleLight1" | "purpleBright" | "purple" | "purpleDark1" | "redLight2" | "redLight1" | "redBright" | "red" | "redDark1" | "tealLight2" | "tealLight1" | "tealBright" | "teal" | "tealDark1" | "yellowLight2" | "yellowLight1" | "yellowBright" | "yellow" | "yellowDark1" | null;
                }) | null;
              }) | {
                /** @description The cover url of the form */
                coverUrl?: string;
                /** @description The logo url of the form */
                logoUrl?: string;
                /** @description The submit button text of the form */
                submitLabel?: string;
              } | {
                /** @description The plugin id */
                pluginId: string;
                /** @description The plugin install id */
                pluginInstallId: string;
                /** @description The plugin logo */
                pluginLogo: string;
              };
              sort?: ({
                sortObjs: ({
                    /** @description The id of the field. */
                    fieldId: string;
                    /** @enum {string} */
                    order: "asc" | "desc";
                  })[];
                manualSort?: boolean;
              }) | null;
              /** @description A filter object for complex query conditions based on fields, operators, and values. Use our visual query builder at https://app.teable.ai/developer/tool/query-builder to build filters. */
              filter?: Record<string, never>;
              group?: (({
                  /** @description The id of the field. */
                  fieldId: string;
                  /** @enum {string} */
                  order: "asc" | "desc";
                })[]) | null;
              isLocked?: boolean;
              shareId?: string;
              enableShare?: boolean;
              shareMeta?: {
                allowCopy?: boolean;
                includeHiddenField?: boolean;
                password?: string;
                includeRecords?: boolean;
                submit?: {
                  allow?: boolean;
                  requireLogin?: boolean;
                };
              };
              createdBy: string;
              lastModifiedBy?: string;
              createdTime: string;
              lastModifiedTime?: string;
              /** @description A mapping of view IDs to their corresponding column metadata. */
              columnMeta: {
                [key: string]: ({
                  /** @description Order is a floating number, column will sort by it in the view. */
                  order: number;
                  /** @description Column width in the view. */
                  width?: number;
                  /** @description If column hidden in the view. */
                  hidden?: boolean;
                  /**
                   * @description Statistic function of the column in the view.
                   * @enum {string|null}
                   */
                  statisticFunc?: "count" | "empty" | "filled" | "unique" | "max" | "min" | "sum" | "average" | "checked" | "unChecked" | "percentEmpty" | "percentFilled" | "percentUnique" | "percentChecked" | "percentUnChecked" | "earliestDate" | "latestDate" | "dateRangeOfDays" | "dateRangeOfMonths" | "totalAttachmentSize" | null;
                }) | {
                  /** @description Order is a floating number, column will sort by it in the view. */
                  order: number;
                  /** @description If column visible in the kanban view. */
                  visible?: boolean;
                } | {
                  /** @description Order is a floating number, column will sort by it in the view. */
                  order: number;
                  /** @description If column visible in the gallery view. */
                  visible?: boolean;
                } | {
                  /** @description Order is a floating number, column will sort by it in the view. */
                  order: number;
                  /** @description If column visible in the view. */
                  visible?: boolean;
                  /** @description If column is required. */
                  required?: boolean;
                } | {
                  /** @description Order is a floating number, column will sort by it in the view. */
                  order: number;
                  /** @description If column hidden in the view. */
                  hidden?: boolean;
                };
              };
              pluginId?: string;
            };
          };
        };
      };
    };
  };
  "/table/{tableId}/view/{viewId}": {
    /** @description Get a view */
    get: {
      parameters: {
        path: {
          tableId: string;
          viewId: string;
        };
      };
      responses: {
        /** @description Returns data about a view. */
        200: {
          content: {
            "application/json": {
              id: string;
              name: string;
              /** @enum {string} */
              type: "grid" | "calendar" | "kanban" | "form" | "gallery" | "plugin";
              description?: string;
              order?: number;
              options?: ({
                /**
                 * @description The row height level of row in view
                 * @enum {string}
                 */
                rowHeight?: "short" | "medium" | "tall" | "extraTall" | "autoFit";
                /** @description The field name display lines in view */
                fieldNameDisplayLines?: number;
                /** @description The frozen column count in view */
                frozenColumnCount?: number;
              }) | ({
                /** @description The field id of the Kanban stack. */
                stackFieldId?: string;
                /** @description The cover field id is a designated attachment field id, the contents of which appear at the top of each Kanban card. */
                coverFieldId?: string | null;
                /** @description If true, cover images are resized to fit Kanban cards. */
                isCoverFit?: boolean;
                /** @description If true, hides field name in the Kanban cards. */
                isFieldNameHidden?: boolean;
                /** @description If true, hides empty stacks in the Kanban. */
                isEmptyStackHidden?: boolean;
              }) | ({
                /** @description The cover field id is a designated attachment field id, the contents of which appear at the top of each gallery card. */
                coverFieldId?: string | null;
                /** @description If true, cover images are resized to fit gallery cards. */
                isCoverFit?: boolean;
                /** @description If true, hides field name in the gallery cards. */
                isFieldNameHidden?: boolean;
              }) | ({
                /** @description The start date field id. */
                startDateFieldId?: string | null;
                /** @description The end date field id. */
                endDateFieldId?: string | null;
                /** @description The title field id. */
                titleFieldId?: string | null;
                colorConfig?: ({
                  /** @enum {string} */
                  type: "field" | "custom";
                  /** @description The color field id. */
                  fieldId?: string | null;
                  /**
                   * @description The color.
                   * @enum {string|null}
                   */
                  color?: "blueLight2" | "blueLight1" | "blueBright" | "blue" | "blueDark1" | "cyanLight2" | "cyanLight1" | "cyanBright" | "cyan" | "cyanDark1" | "grayLight2" | "grayLight1" | "grayBright" | "gray" | "grayDark1" | "greenLight2" | "greenLight1" | "greenBright" | "green" | "greenDark1" | "orangeLight2" | "orangeLight1" | "orangeBright" | "orange" | "orangeDark1" | "pinkLight2" | "pinkLight1" | "pinkBright" | "pink" | "pinkDark1" | "purpleLight2" | "purpleLight1" | "purpleBright" | "purple" | "purpleDark1" | "redLight2" | "redLight1" | "redBright" | "red" | "redDark1" | "tealLight2" | "tealLight1" | "tealBright" | "teal" | "tealDark1" | "yellowLight2" | "yellowLight1" | "yellowBright" | "yellow" | "yellowDark1" | null;
                }) | null;
              }) | {
                /** @description The cover url of the form */
                coverUrl?: string;
                /** @description The logo url of the form */
                logoUrl?: string;
                /** @description The submit button text of the form */
                submitLabel?: string;
              } | {
                /** @description The plugin id */
                pluginId: string;
                /** @description The plugin install id */
                pluginInstallId: string;
                /** @description The plugin logo */
                pluginLogo: string;
              };
              sort?: ({
                sortObjs: ({
                    /** @description The id of the field. */
                    fieldId: string;
                    /** @enum {string} */
                    order: "asc" | "desc";
                  })[];
                manualSort?: boolean;
              }) | null;
              /** @description A filter object for complex query conditions based on fields, operators, and values. Use our visual query builder at https://app.teable.ai/developer/tool/query-builder to build filters. */
              filter?: Record<string, never>;
              group?: (({
                  /** @description The id of the field. */
                  fieldId: string;
                  /** @enum {string} */
                  order: "asc" | "desc";
                })[]) | null;
              isLocked?: boolean;
              shareId?: string;
              enableShare?: boolean;
              shareMeta?: {
                allowCopy?: boolean;
                includeHiddenField?: boolean;
                password?: string;
                includeRecords?: boolean;
                submit?: {
                  allow?: boolean;
                  requireLogin?: boolean;
                };
              };
              createdBy: string;
              lastModifiedBy?: string;
              createdTime: string;
              lastModifiedTime?: string;
              /** @description A mapping of view IDs to their corresponding column metadata. */
              columnMeta: {
                [key: string]: ({
                  /** @description Order is a floating number, column will sort by it in the view. */
                  order: number;
                  /** @description Column width in the view. */
                  width?: number;
                  /** @description If column hidden in the view. */
                  hidden?: boolean;
                  /**
                   * @description Statistic function of the column in the view.
                   * @enum {string|null}
                   */
                  statisticFunc?: "count" | "empty" | "filled" | "unique" | "max" | "min" | "sum" | "average" | "checked" | "unChecked" | "percentEmpty" | "percentFilled" | "percentUnique" | "percentChecked" | "percentUnChecked" | "earliestDate" | "latestDate" | "dateRangeOfDays" | "dateRangeOfMonths" | "totalAttachmentSize" | null;
                }) | {
                  /** @description Order is a floating number, column will sort by it in the view. */
                  order: number;
                  /** @description If column visible in the kanban view. */
                  visible?: boolean;
                } | {
                  /** @description Order is a floating number, column will sort by it in the view. */
                  order: number;
                  /** @description If column visible in the gallery view. */
                  visible?: boolean;
                } | {
                  /** @description Order is a floating number, column will sort by it in the view. */
                  order: number;
                  /** @description If column visible in the view. */
                  visible?: boolean;
                  /** @description If column is required. */
                  required?: boolean;
                } | {
                  /** @description Order is a floating number, column will sort by it in the view. */
                  order: number;
                  /** @description If column hidden in the view. */
                  hidden?: boolean;
                };
              };
              pluginId?: string;
            };
          };
        };
      };
    };
    /** @description Delete a view */
    delete: {
      parameters: {
        path: {
          tableId: string;
          viewId: string;
        };
      };
      responses: {
        /** @description Deleted successfully */
        200: {
          content: never;
        };
      };
    };
  };
  "/table/{tableId}/view/{viewId}/manual-sort": {
    /** @description Update view raw order */
    put: {
      parameters: {
        path: {
          tableId: string;
          viewId: string;
        };
      };
      requestBody?: {
        content: {
          "application/json": {
            sortObjs: ({
                /** @description The id of the field. */
                fieldId: string;
                /** @enum {string} */
                order: "asc" | "desc";
              })[];
          };
        };
      };
      responses: {
        /** @description Successfully update. */
        200: {
          content: never;
        };
      };
    };
  };
  "/table/{tableId}/view/{viewId}/column-meta": {
    /** @description Update view column meta */
    put: {
      parameters: {
        path: {
          tableId: string;
          viewId: string;
        };
      };
      requestBody?: {
        content: {
          "application/json": ({
              /** @description Field ID */
              fieldId: string;
              columnMeta: ({
                /** @description Order is a floating number, column will sort by it in the view. */
                order?: number;
                /** @description Column width in the view. */
                width?: number;
                /** @description If column hidden in the view. */
                hidden?: boolean;
                /**
                 * @description Statistic function of the column in the view.
                 * @enum {string|null}
                 */
                statisticFunc?: "count" | "empty" | "filled" | "unique" | "max" | "min" | "sum" | "average" | "checked" | "unChecked" | "percentEmpty" | "percentFilled" | "percentUnique" | "percentChecked" | "percentUnChecked" | "earliestDate" | "latestDate" | "dateRangeOfDays" | "dateRangeOfMonths" | "totalAttachmentSize" | null;
              }) | {
                /** @description Order is a floating number, column will sort by it in the view. */
                order?: number;
                /** @description If column visible in the kanban view. */
                visible?: boolean;
              } | {
                /** @description Order is a floating number, column will sort by it in the view. */
                order?: number;
                /** @description If column visible in the view. */
                visible?: boolean;
                /** @description If column is required. */
                required?: boolean;
              } | {
                /** @description Order is a floating number, column will sort by it in the view. */
                order?: number;
                /** @description If column hidden in the view. */
                hidden?: boolean;
              };
            })[];
        };
      };
      responses: {
        /** @description Successfully update. */
        200: {
          content: never;
        };
      };
    };
  };
  "/table/{tableId}/view/{viewId}/filter": {
    /** @description Update view filter */
    put: {
      parameters: {
        path: {
          tableId: string;
          viewId: string;
        };
      };
      requestBody?: {
        content: {
          "application/json": Record<string, never>;
        };
      };
      responses: {
        /** @description Successfully update. */
        200: {
          content: never;
        };
      };
    };
  };
  "/table/{tableId}/view/{viewId}/sort": {
    /** @description Update view sort condition */
    put: {
      parameters: {
        path: {
          tableId: string;
          viewId: string;
        };
      };
      requestBody?: {
        content: {
          "application/json": ({
            sortObjs: ({
                /** @description The id of the field. */
                fieldId: string;
                /** @enum {string} */
                order: "asc" | "desc";
              })[];
            manualSort?: boolean;
          }) | null;
        };
      };
      responses: {
        /** @description Successfully update. */
        200: {
          content: never;
        };
      };
    };
  };
  "/table/{tableId}/view/{viewId}/group": {
    /** @description Update view group condition */
    put: {
      parameters: {
        path: {
          tableId: string;
          viewId: string;
        };
      };
      requestBody?: {
        content: {
          "application/json": (({
              /** @description The id of the field. */
              fieldId: string;
              /** @enum {string} */
              order: "asc" | "desc";
            })[]) | null;
        };
      };
      responses: {
        /** @description Successfully update. */
        200: {
          content: never;
        };
      };
    };
  };
  "/table/{tableId}/view/{viewId}/options": {
    /** @description Update view option */
    patch: {
      parameters: {
        path: {
          tableId: string;
          viewId: string;
        };
      };
      requestBody?: {
        content: {
          "application/json": {
            options: ({
              /**
               * @description The row height level of row in view
               * @enum {string}
               */
              rowHeight?: "short" | "medium" | "tall" | "extraTall" | "autoFit";
              /** @description The field name display lines in view */
              fieldNameDisplayLines?: number;
              /** @description The frozen column count in view */
              frozenColumnCount?: number;
            }) | ({
              /** @description The field id of the Kanban stack. */
              stackFieldId?: string;
              /** @description The cover field id is a designated attachment field id, the contents of which appear at the top of each Kanban card. */
              coverFieldId?: string | null;
              /** @description If true, cover images are resized to fit Kanban cards. */
              isCoverFit?: boolean;
              /** @description If true, hides field name in the Kanban cards. */
              isFieldNameHidden?: boolean;
              /** @description If true, hides empty stacks in the Kanban. */
              isEmptyStackHidden?: boolean;
            }) | ({
              /** @description The cover field id is a designated attachment field id, the contents of which appear at the top of each gallery card. */
              coverFieldId?: string | null;
              /** @description If true, cover images are resized to fit gallery cards. */
              isCoverFit?: boolean;
              /** @description If true, hides field name in the gallery cards. */
              isFieldNameHidden?: boolean;
            }) | ({
              /** @description The start date field id. */
              startDateFieldId?: string | null;
              /** @description The end date field id. */
              endDateFieldId?: string | null;
              /** @description The title field id. */
              titleFieldId?: string | null;
              colorConfig?: ({
                /** @enum {string} */
                type: "field" | "custom";
                /** @description The color field id. */
                fieldId?: string | null;
                /**
                 * @description The color.
                 * @enum {string|null}
                 */
                color?: "blueLight2" | "blueLight1" | "blueBright" | "blue" | "blueDark1" | "cyanLight2" | "cyanLight1" | "cyanBright" | "cyan" | "cyanDark1" | "grayLight2" | "grayLight1" | "grayBright" | "gray" | "grayDark1" | "greenLight2" | "greenLight1" | "greenBright" | "green" | "greenDark1" | "orangeLight2" | "orangeLight1" | "orangeBright" | "orange" | "orangeDark1" | "pinkLight2" | "pinkLight1" | "pinkBright" | "pink" | "pinkDark1" | "purpleLight2" | "purpleLight1" | "purpleBright" | "purple" | "purpleDark1" | "redLight2" | "redLight1" | "redBright" | "red" | "redDark1" | "tealLight2" | "tealLight1" | "tealBright" | "teal" | "tealDark1" | "yellowLight2" | "yellowLight1" | "yellowBright" | "yellow" | "yellowDark1" | null;
              }) | null;
            }) | {
              /** @description The cover url of the form */
              coverUrl?: string;
              /** @description The logo url of the form */
              logoUrl?: string;
              /** @description The submit button text of the form */
              submitLabel?: string;
            } | {
              /** @description The plugin id */
              pluginId: string;
              /** @description The plugin install id */
              pluginInstallId: string;
              /** @description The plugin logo */
              pluginLogo: string;
            };
          };
        };
      };
      responses: {
        /** @description Successfully update. */
        200: {
          content: never;
        };
      };
    };
  };
  "/table/{tableId}/view/{viewId}/record-order": {
    /** @description Update record order in view */
    put: {
      parameters: {
        path: {
          tableId: string;
          viewId: string;
        };
      };
      requestBody?: {
        content: {
          "application/json": {
            /** @description Id of the record that you want to move other records around */
            anchorId: string;
            /** @enum {string} */
            position: "before" | "after";
            /** @description Ids of those records you want to move */
            recordIds: string[];
          };
        };
      };
      responses: {
        /** @description Successfully update. */
        200: {
          content: never;
        };
      };
    };
  };
  "/table/{tableId}/view/{viewId}/name": {
    /** @description Update view name */
    put: {
      parameters: {
        path: {
          tableId: string;
          viewId: string;
        };
      };
      requestBody?: {
        content: {
          "application/json": {
            name: string;
          };
        };
      };
      responses: {
        /** @description Successfully update. */
        200: {
          content: never;
        };
      };
    };
  };
  "/table/{tableId}/view/{viewId}/description": {
    /** @description Update view description */
    put: {
      parameters: {
        path: {
          tableId: string;
          viewId: string;
        };
      };
      requestBody?: {
        content: {
          "application/json": {
            description: string;
          };
        };
      };
      responses: {
        /** @description Successfully update. */
        200: {
          content: never;
        };
      };
    };
  };
  "/table/{tableId}/view/{viewId}/share-meta": {
    /** @description Update view share meta */
    put: {
      parameters: {
        path: {
          tableId: string;
          viewId: string;
        };
      };
      requestBody?: {
        content: {
          "application/json": {
            allowCopy?: boolean;
            includeHiddenField?: boolean;
            password?: string;
            includeRecords?: boolean;
            submit?: {
              allow?: boolean;
              requireLogin?: boolean;
            };
          };
        };
      };
      responses: {
        /** @description Successfully update. */
        200: {
          content: never;
        };
      };
    };
  };
  "/table/{tableId}/view/{viewId}/refresh-share-id": {
    /** @description Refresh view share id */
    post: {
      parameters: {
        path: {
          tableId: string;
          viewId: string;
        };
      };
      responses: {
        /** @description Returns successfully refreshed view share id */
        201: {
          content: {
            "application/json": {
              shareId: string;
            };
          };
        };
      };
    };
  };
  "/table/{tableId}/view/{viewId}/disable-share": {
    /** @description Disable view share */
    post: {
      parameters: {
        path: {
          tableId: string;
          viewId: string;
        };
      };
      responses: {
        /** @description Returns successfully disable view share */
        201: {
          content: never;
        };
      };
    };
  };
  "/table/{tableId}/view/{viewId}/enable-share": {
    /** @description Enable view share */
    post: {
      parameters: {
        path: {
          tableId: string;
          viewId: string;
        };
      };
      responses: {
        /** @description Returns successfully enable view share */
        201: {
          content: {
            "application/json": {
              shareId: string;
            };
          };
        };
      };
    };
  };
  "/table/{tableId}/view/plugin": {
    /** @description Install a plugin to a view */
    post: {
      parameters: {
        path: {
          tableId: string;
        };
      };
      requestBody?: {
        content: {
          "application/json": {
            name?: string;
            pluginId: string;
          };
        };
      };
      responses: {
        /** @description Returns data about the installed plugin. */
        201: {
          content: {
            "application/json": {
              pluginId: string;
              pluginInstallId: string;
              name: string;
              viewId: string;
            };
          };
        };
      };
    };
  };
  "/table/{tableId}/view/{viewId}/plugin/{pluginInstallId}": {
    /** @description Update storage of a plugin in a view */
    patch: {
      parameters: {
        path: {
          tableId: string;
          viewId: string;
          pluginInstallId: string;
        };
      };
      requestBody?: {
        content: {
          "application/json": {
            storage?: {
              [key: string]: unknown;
            };
          };
        };
      };
      responses: {
        /** @description Returns data about the updated plugin. */
        200: {
          content: {
            "application/json": {
              tableId: string;
              viewId: string;
              pluginInstallId: string;
              storage?: {
                [key: string]: unknown;
              };
            };
          };
        };
      };
    };
  };
  "/table/{tableId}/view/{viewId}/plugin": {
    /** @description Get a view install plugin by id */
    get: {
      parameters: {
        path: {
          tableId: string;
          viewId: string;
        };
      };
      responses: {
        /** @description Returns data about the view install plugin. */
        200: {
          content: {
            "application/json": {
              pluginId: string;
              pluginInstallId: string;
              baseId: string;
              name: string;
              url?: string;
              storage?: {
                [key: string]: unknown;
              };
            };
          };
        };
      };
    };
  };
  "/table/{tableId}/view/{viewId}/locked": {
    /** @description Update the locked status of the view */
    put: {
      parameters: {
        path: {
          tableId: string;
          viewId: string;
        };
      };
      requestBody?: {
        content: {
          "application/json": {
            isLocked?: boolean;
          };
        };
      };
      responses: {
        /** @description Successfully update. */
        200: {
          content: never;
        };
      };
    };
  };
  "/table/{tableId}/aggregation": {
    /**
     * Get aggregated statistics
     * @description Returns statistical aggregations of table data based on specified functions and grouping criteria
     */
    get: {
      parameters: {
        path: {
          tableId: string;
        };
      };
      responses: {
        /** @description Returns aggregations list. */
        200: {
          content: {
            "application/json": ({
                aggregations?: ({
                    /** @description The id of the field. */
                    fieldId: string;
                    /** @description Aggregations by all data in field */
                    total: ({
                      value: unknown;
                      /** @enum {string} */
                      aggFunc: "count" | "empty" | "filled" | "unique" | "max" | "min" | "sum" | "average" | "checked" | "unChecked" | "percentEmpty" | "percentFilled" | "percentUnique" | "percentChecked" | "percentUnChecked" | "earliestDate" | "latestDate" | "dateRangeOfDays" | "dateRangeOfMonths" | "totalAttachmentSize";
                    }) | null;
                    /** @description Aggregations by grouped data in field */
                    group?: ({
                      [key: string]: {
                        value: unknown;
                        /** @enum {string} */
                        aggFunc: "count" | "empty" | "filled" | "unique" | "max" | "min" | "sum" | "average" | "checked" | "unChecked" | "percentEmpty" | "percentFilled" | "percentUnique" | "percentChecked" | "percentUnChecked" | "earliestDate" | "latestDate" | "dateRangeOfDays" | "dateRangeOfMonths" | "totalAttachmentSize";
                      };
                    }) | null;
                  })[];
              })[];
          };
        };
      };
    };
  };
  "/table/{tableId}/aggregation/row-count": {
    /**
     * Get total row count
     * @description Returns the total number of rows in a view based on applied filters and criteria
     */
    get: {
      parameters: {
        query?: {
          viewId?: string;
          ignoreViewQuery?: string | boolean;
          filterByTql?: string;
          filter?: string;
          search?: string[] | ((string | (string | boolean))[]);
          filterLinkCellCandidate?: string[] | string;
          filterLinkCellSelected?: string[] | string;
          selectedRecordIds?: string[];
        };
        path: {
          tableId: string;
        };
      };
      responses: {
        /** @description Row count for the view */
        200: {
          content: {
            "application/json": {
              rowCount: number;
            };
          };
        };
      };
    };
  };
  "/table/{tableId}/aggregation/group-points": {
    /**
     * Get group points
     * @description Returns the distribution and count of records across different group points in the view
     */
    get: {
      parameters: {
        query?: {
          viewId?: string;
          filter?: string;
          search?: string[] | ((string | (string | boolean))[]);
          groupBy?: string;
          collapsedGroupIds?: string;
          ignoreViewQuery?: string | boolean;
        };
        path: {
          tableId: string;
        };
      };
      responses: {
        /** @description Group points for the view */
        200: {
          content: {
            "application/json": (({
                id: string;
                /** @enum {number} */
                type: 0;
                depth: number;
                value?: unknown;
                isCollapsed: boolean;
              } | {
                /** @enum {number} */
                type: 1;
                count: number;
              })[]) | null;
          };
        };
      };
    };
  };
  "/table/{tableId}/aggregation/calendar-daily-collection": {
    /**
     * Get daily calendar data
     * @description Returns records and count distribution across dates based on specified date range and fields
     */
    get: {
      parameters: {
        query: {
          viewId?: string;
          filter?: string;
          search?: string[] | ((string | (string | boolean))[]);
          ignoreViewQuery?: string | boolean;
          startDate: string;
          endDate: string;
          startDateFieldId: string;
          endDateFieldId: string;
        };
        path: {
          tableId: string;
        };
      };
      responses: {
        /** @description Calendar daily collection for the view */
        200: {
          content: {
            "application/json": {
              countMap: {
                [key: string]: number;
              };
              records: {
                  /** @description The record id. */
                  id: string;
                  /** @description primary field value */
                  name?: string;
                  /** @description Objects with a fields key mapping fieldId or field name to value for that field. */
                  fields: {
                    [key: string]: unknown;
                  };
                  /** @description Auto number, a unique identifier for each record */
                  autoNumber?: number;
                  /** @description Created time, date ISO string (new Date().toISOString). */
                  createdTime?: string;
                  /** @description Last modified time, date ISO string (new Date().toISOString). */
                  lastModifiedTime?: string;
                  /** @description Created by, user name */
                  createdBy?: string;
                  /** @description Last modified by, user name */
                  lastModifiedBy?: string;
                  /** @description Permissions for the record */
                  permissions?: {
                    [key: string]: {
                      [key: string]: boolean;
                    };
                  };
                  /** @description Whether the record is undeletable */
                  undeletable?: boolean;
                }[];
            };
          };
        };
      };
    };
  };
  "/table/{tableId}/aggregation/search-count": {
    /**
     * Get total count of search
     * @description Returns the total count of records matching the specified search criteria and filters
     */
    get: {
      parameters: {
        query?: {
          filter?: string;
          viewId?: string;
          search?: string[] | ((string | (string | boolean))[]);
          ignoreViewQuery?: string | boolean;
        };
        path: {
          tableId: string;
        };
      };
      responses: {
        /** @description Search count with query */
        200: {
          content: {
            "application/json": {
              count: number;
            };
          };
        };
      };
    };
  };
  "/table/{tableId}/aggregation/search-index": {
    /**
     * Get record indices for search
     * @description Returns the indices and record IDs of records matching the search criteria
     */
    get: {
      parameters: {
        query?: {
          viewId?: string;
          ignoreViewQuery?: string | boolean;
          filterByTql?: string;
          filter?: string;
          search?: string[] | ((string | (string | boolean))[]);
          filterLinkCellCandidate?: string[] | string;
          filterLinkCellSelected?: string[] | string;
          selectedRecordIds?: string[];
        };
        path: {
          tableId: string;
        };
      };
      responses: {
        /** @description record index with search query */
        200: {
          content: {
            "application/json": {
                index: number;
                fieldId: string;
                recordId: string;
              }[] | null;
          };
        };
      };
    };
  };
  "/table/{tableId}/aggregation/task-status-collection": {
    /**
     * Get task status collection
     * @description Returns records and count distribution across task status based on specified date range and fields
     */
    get: {
      parameters: {
        path: {
          tableId: string;
        };
      };
      responses: {
        /** @description Task status collection for the view */
        200: {
          content: {
            "application/json": {
              cells: {
                  recordId: string;
                  fieldId: string;
                }[];
              fieldMap: {
                [key: string]: {
                  taskId: string;
                  completedCount: number;
                  totalCount: number;
                };
              };
            };
          };
        };
      };
    };
  };
  "/base/{baseId}/table/": {
    /**
     * Create table
     * @description Create a new table in the specified base with customizable fields, views, and initial records. Default configurations will be applied if not specified.
     */
    post: {
      parameters: {
        path: {
          baseId: string;
        };
      };
      requestBody?: {
        content: {
          "application/json": {
            /** @description The name of the table. */
            name?: string;
            /** @description Table name in backend database. Limitation: 1-63 characters, start with letter, can only contain letters, numbers and underscore, case insensitive, cannot be duplicated with existing db table name in the base. */
            dbTableName?: string;
            /** @description The description of the table. */
            description?: string | null;
            /** @description The emoji icon string of the table. */
            icon?: string | null;
            /** @description The fields of the table. If it is empty, 3 fields include SingleLineText, Number, SingleSelect will and 3 empty records be generated by default. */
            fields?: ({
                /**
                 * @description The field types supported by teable.
                 * @example singleSelect
                 * @enum {string}
                 */
                type: "singleLineText" | "longText" | "user" | "attachment" | "checkbox" | "multipleSelect" | "singleSelect" | "date" | "number" | "rating" | "formula" | "rollup" | "link" | "createdTime" | "lastModifiedTime" | "createdBy" | "lastModifiedBy" | "autoNumber" | "button" | "department" | "createdByDepartment" | "lastModifiedByDepartment";
                /**
                 * @description The name of the field. can not be duplicated in the table.
                 * @example Tags
                 */
                name?: string;
                /** @description Whether this field is not unique. */
                unique?: boolean;
                /** @description Whether this field is not null. */
                notNull?: boolean;
                /** @description Field(column) name in backend database. Limitation: 1-63 characters, can only contain letters, numbers and underscore, case sensitive, cannot be duplicated with existing db field name in the table. */
                dbFieldName?: string;
                /** @description Whether this field is lookup field. witch means cellValue and [fieldType] is looked up from the linked table. */
                isLookup?: boolean;
                /**
                 * @description The description of the field.
                 * @example this is a summary
                 */
                description?: string | null;
                /** @description The lookup options for field, you need to configure it when isLookup attribute is true or field type is rollup. */
                lookupOptions?: {
                  /** @description the table this field is linked to */
                  foreignTableId: string;
                  /** @description the field in the foreign table that will be displayed as the current field */
                  lookupFieldId: string;
                  /** @description The id of Linked record field to use for lookup */
                  linkFieldId: string;
                  /** @description A filter object for complex query conditions based on fields, operators, and values. Use our visual query builder at https://app.teable.ai/developer/tool/query-builder to build filters. */
                  filter?: Record<string, never>;
                };
                /** @description The options of the field. The configuration of the field's options depend on the it's specific type. */
                options?: ({
                  /** @enum {string} */
                  expression: "countall({values})" | "counta({values})" | "count({values})" | "sum({values})" | "max({values})" | "min({values})" | "and({values})" | "or({values})" | "xor({values})" | "array_join({values})" | "array_unique({values})" | "array_compact({values})" | "concatenate({values})";
                  /** @description The time zone that should be used to format dates */
                  timeZone?: string;
                  /** @description Different cell value types are determined based on the results of expression parsing, where numbers, dates, and formatting options are provided */
                  formatting?: ({
                    /** @description the display formatting of the date. you can use the following presets: M/D/YYYY, D/M/YYYY, YYYY/MM/DD, YYYY-MM-DD, YYYY-MM, MM-DD, YYYY, MM, DD */
                    date: string;
                    /**
                     * @description the display formatting of the time. you can use the following presets: HH:mm, hh:mm A, None
                     * @enum {string}
                     */
                    time: "HH:mm" | "hh:mm A" | "None";
                    /** @description The time zone that should be used to format dates */
                    timeZone: string;
                  }) | {
                    precision: number;
                    /** @enum {string} */
                    type: "decimal";
                  } | {
                    precision: number;
                    /** @enum {string} */
                    type: "percent";
                  } | {
                    precision: number;
                    /** @enum {string} */
                    type: "currency";
                    symbol: string;
                  };
                  /** @description According to the results of expression parsing to determine different visual effects, where strings, numbers will provide customized "show as" */
                  showAs?: ({
                    /**
                     * @description can display as url, email or phone in string field with a button to perform the corresponding action, start a phone call, send an email, or open a link in a new tab
                     * @enum {string}
                     */
                    type: "url" | "email" | "phone";
                  }) | ({
                    /**
                     * @description can display as bar or ring in number field with single cellValue value
                     * @enum {string}
                     */
                    type: "bar" | "ring";
                    /** @enum {string} */
                    color: "blueLight2" | "blueLight1" | "blueBright" | "blue" | "blueDark1" | "cyanLight2" | "cyanLight1" | "cyanBright" | "cyan" | "cyanDark1" | "grayLight2" | "grayLight1" | "grayBright" | "gray" | "grayDark1" | "greenLight2" | "greenLight1" | "greenBright" | "green" | "greenDark1" | "orangeLight2" | "orangeLight1" | "orangeBright" | "orange" | "orangeDark1" | "pinkLight2" | "pinkLight1" | "pinkBright" | "pink" | "pinkDark1" | "purpleLight2" | "purpleLight1" | "purpleBright" | "purple" | "purpleDark1" | "redLight2" | "redLight1" | "redBright" | "red" | "redDark1" | "tealLight2" | "tealLight1" | "tealBright" | "teal" | "tealDark1" | "yellowLight2" | "yellowLight1" | "yellowBright" | "yellow" | "yellowDark1";
                    /** @description whether to displays the specific value on the graph */
                    showValue: boolean;
                    /** @description the value that represents a 100% maximum value, it does not represent a hard limit on the value */
                    maxValue: number;
                  }) | ({
                    /**
                     * @description can display as bar or line in number field with multiple cellValue value
                     * @enum {string}
                     */
                    type: "bar" | "line";
                    /** @enum {string} */
                    color: "blueLight2" | "blueLight1" | "blueBright" | "blue" | "blueDark1" | "cyanLight2" | "cyanLight1" | "cyanBright" | "cyan" | "cyanDark1" | "grayLight2" | "grayLight1" | "grayBright" | "gray" | "grayDark1" | "greenLight2" | "greenLight1" | "greenBright" | "green" | "greenDark1" | "orangeLight2" | "orangeLight1" | "orangeBright" | "orange" | "orangeDark1" | "pinkLight2" | "pinkLight1" | "pinkBright" | "pink" | "pinkDark1" | "purpleLight2" | "purpleLight1" | "purpleBright" | "purple" | "purpleDark1" | "redLight2" | "redLight1" | "redBright" | "red" | "redDark1" | "tealLight2" | "tealLight1" | "tealBright" | "teal" | "tealDark1" | "yellowLight2" | "yellowLight1" | "yellowBright" | "yellow" | "yellowDark1";
                  });
                }) | ({
                  /** @description The formula including fields referenced by their IDs. For example, LEFT(4, {Birthday}) input will be returned as LEFT(4, {fldXXX}) via API. The formula syntax in Teable is basically the same as Airtable */
                  expression: string;
                  /** @description The time zone that should be used to format dates */
                  timeZone?: string;
                  /** @description Different cell value types are determined based on the results of expression parsing, where numbers, dates, and formatting options are provided */
                  formatting?: ({
                    /** @description the display formatting of the date. you can use the following presets: M/D/YYYY, D/M/YYYY, YYYY/MM/DD, YYYY-MM-DD, YYYY-MM, MM-DD, YYYY, MM, DD */
                    date: string;
                    /**
                     * @description the display formatting of the time. you can use the following presets: HH:mm, hh:mm A, None
                     * @enum {string}
                     */
                    time: "HH:mm" | "hh:mm A" | "None";
                    /** @description The time zone that should be used to format dates */
                    timeZone: string;
                  }) | {
                    precision: number;
                    /** @enum {string} */
                    type: "decimal";
                  } | {
                    precision: number;
                    /** @enum {string} */
                    type: "percent";
                  } | {
                    precision: number;
                    /** @enum {string} */
                    type: "currency";
                    symbol: string;
                  };
                  /** @description According to the results of expression parsing to determine different visual effects, where strings, numbers will provide customized "show as" */
                  showAs?: ({
                    /**
                     * @description can display as url, email or phone in string field with a button to perform the corresponding action, start a phone call, send an email, or open a link in a new tab
                     * @enum {string}
                     */
                    type: "url" | "email" | "phone";
                  }) | ({
                    /**
                     * @description can display as bar or ring in number field with single cellValue value
                     * @enum {string}
                     */
                    type: "bar" | "ring";
                    /** @enum {string} */
                    color: "blueLight2" | "blueLight1" | "blueBright" | "blue" | "blueDark1" | "cyanLight2" | "cyanLight1" | "cyanBright" | "cyan" | "cyanDark1" | "grayLight2" | "grayLight1" | "grayBright" | "gray" | "grayDark1" | "greenLight2" | "greenLight1" | "greenBright" | "green" | "greenDark1" | "orangeLight2" | "orangeLight1" | "orangeBright" | "orange" | "orangeDark1" | "pinkLight2" | "pinkLight1" | "pinkBright" | "pink" | "pinkDark1" | "purpleLight2" | "purpleLight1" | "purpleBright" | "purple" | "purpleDark1" | "redLight2" | "redLight1" | "redBright" | "red" | "redDark1" | "tealLight2" | "tealLight1" | "tealBright" | "teal" | "tealDark1" | "yellowLight2" | "yellowLight1" | "yellowBright" | "yellow" | "yellowDark1";
                    /** @description whether to displays the specific value on the graph */
                    showValue: boolean;
                    /** @description the value that represents a 100% maximum value, it does not represent a hard limit on the value */
                    maxValue: number;
                  }) | ({
                    /**
                     * @description can display as bar or line in number field with multiple cellValue value
                     * @enum {string}
                     */
                    type: "bar" | "line";
                    /** @enum {string} */
                    color: "blueLight2" | "blueLight1" | "blueBright" | "blue" | "blueDark1" | "cyanLight2" | "cyanLight1" | "cyanBright" | "cyan" | "cyanDark1" | "grayLight2" | "grayLight1" | "grayBright" | "gray" | "grayDark1" | "greenLight2" | "greenLight1" | "greenBright" | "green" | "greenDark1" | "orangeLight2" | "orangeLight1" | "orangeBright" | "orange" | "orangeDark1" | "pinkLight2" | "pinkLight1" | "pinkBright" | "pink" | "pinkDark1" | "purpleLight2" | "purpleLight1" | "purpleBright" | "purple" | "purpleDark1" | "redLight2" | "redLight1" | "redBright" | "red" | "redDark1" | "tealLight2" | "tealLight1" | "tealBright" | "teal" | "tealDark1" | "yellowLight2" | "yellowLight1" | "yellowBright" | "yellow" | "yellowDark1";
                  });
                }) | ({
                  /** @description the base id of the table that this field is linked to, only required for cross base link */
                  baseId?: string;
                  /**
                   * @description describe the relationship from this table to the foreign table
                   * @enum {string}
                   */
                  relationship: "oneOne" | "manyMany" | "oneMany" | "manyOne";
                  /** @description the table this field is linked to */
                  foreignTableId: string;
                  /** @description the field in the foreign table that will be displayed as the current field */
                  lookupFieldId: string;
                  /** @description whether the field is a one-way link, when true, it will not generate a symmetric field, it is generally has better performance */
                  isOneWay?: boolean;
                  /** @description the table name for storing keys, in many-to-many relationships, keys are stored in a separate intermediate table; in other relationships, keys are stored on one side as needed */
                  fkHostTableName: string;
                  /** @description the name of the field that stores the current table primary key */
                  selfKeyName: string;
                  /** @description The name of the field that stores the foreign table primary key */
                  foreignKeyName: string;
                  /** @description the symmetric field in the foreign table, empty if the field is a one-way link */
                  symmetricFieldId?: string;
                  /** @description the view id that limits the number of records in the link field */
                  filterByViewId?: string | null;
                  /** @description the fields that will be displayed in the link field */
                  visibleFieldIds?: string[] | null;
                  /** @description A filter object for complex query conditions based on fields, operators, and values. Use our visual query builder at https://app.teable.ai/developer/tool/query-builder to build filters. */
                  filter?: Record<string, never>;
                }) | ({
                  /** @description caveat: the formatting is just a formatter, it dose not effect the storing value of the record */
                  formatting: {
                    /** @description the display formatting of the date. you can use the following presets: M/D/YYYY, D/M/YYYY, YYYY/MM/DD, YYYY-MM-DD, YYYY-MM, MM-DD, YYYY, MM, DD */
                    date: string;
                    /**
                     * @description the display formatting of the time. you can use the following presets: HH:mm, hh:mm A, None
                     * @enum {string}
                     */
                    time: "HH:mm" | "hh:mm A" | "None";
                    /** @description The time zone that should be used to format dates */
                    timeZone: string;
                  };
                  /**
                   * @description Whether the new row is automatically filled with the current time, caveat: the defaultValue is just a flag, it dose not effect the storing value of the record
                   * @enum {string}
                   */
                  defaultValue?: "now";
                }) | {
                  defaultValue?: boolean;
                } | Record<string, never> | ({
                  /** @description Only be used in single line text field or formula / rollup field with cellValueType equals String and isMultipleCellValue is not true */
                  showAs?: {
                    /**
                     * @description can display as url, email or phone in string field with a button to perform the corresponding action, start a phone call, send an email, or open a link in a new tab
                     * @enum {string}
                     */
                    type: "url" | "email" | "phone";
                  };
                  defaultValue?: string;
                }) | ({
                  /** @enum {string} */
                  icon: "star" | "moon" | "sun" | "zap" | "flame" | "heart" | "apple" | "thumb-up";
                  /** @enum {string} */
                  color: "yellowBright" | "redBright" | "tealBright";
                  max: number;
                }) | ({
                  /** @description Allow adding multiple users */
                  isMultiple?: boolean;
                  /** @description Notify users when their name is added to a cell */
                  shouldNotify?: boolean;
                  defaultValue?: string | "me" | ((string | "me")[]);
                }) | ({
                  /** @description Button label */
                  label: string;
                  /**
                   * @description Button color
                   * @enum {string}
                   */
                  color: "blueLight2" | "blueLight1" | "blueBright" | "blue" | "blueDark1" | "cyanLight2" | "cyanLight1" | "cyanBright" | "cyan" | "cyanDark1" | "grayLight2" | "grayLight1" | "grayBright" | "gray" | "grayDark1" | "greenLight2" | "greenLight1" | "greenBright" | "green" | "greenDark1" | "orangeLight2" | "orangeLight1" | "orangeBright" | "orange" | "orangeDark1" | "pinkLight2" | "pinkLight1" | "pinkBright" | "pink" | "pinkDark1" | "purpleLight2" | "purpleLight1" | "purpleBright" | "purple" | "purpleDark1" | "redLight2" | "redLight1" | "redBright" | "red" | "redDark1" | "tealLight2" | "tealLight1" | "tealBright" | "teal" | "tealDark1" | "yellowLight2" | "yellowLight1" | "yellowBright" | "yellow" | "yellowDark1";
                  /** @description Max count of button clicks */
                  maxCount?: number;
                  /** @description Reset count */
                  resetCount?: boolean;
                  /** @description Workflow */
                  workflow?: {
                    /** @description Workflow ID */
                    id?: string;
                    /** @description Workflow Name */
                    name?: string;
                    /** @description Workflow is active */
                    isActive?: boolean;
                  } | null;
                }) | ({
                  /** @description the base id of the table that this field is linked to, only required for cross base link */
                  baseId?: string;
                  /**
                   * @description describe the relationship from this table to the foreign table
                   * @enum {string}
                   */
                  relationship: "oneOne" | "manyMany" | "oneMany" | "manyOne";
                  /** @description the table this field is linked to */
                  foreignTableId: string;
                  /** @description whether the field is a one-way link, when true, it will not generate a symmetric field, it is generally has better performance */
                  isOneWay?: boolean;
                  /** @description the view id that limits the number of records in the link field */
                  filterByViewId?: string | null;
                  /** @description the fields that will be displayed in the link field */
                  visibleFieldIds?: string[] | null;
                  /** @description A filter object for complex query conditions based on fields, operators, and values. Use our visual query builder at https://app.teable.ai/developer/tool/query-builder to build filters. */
                  filter?: Record<string, never>;
                  /** @description Link field will display the value of this field from the foreign table, if not provided, it will use the primary field of the foreign table, in common case you can safely ignore it */
                  lookupFieldId?: string;
                }) | ({
                  choices: ({
                      id?: string;
                      name: string;
                      /** @enum {string} */
                      color?: "blueLight2" | "blueLight1" | "blueBright" | "blue" | "blueDark1" | "cyanLight2" | "cyanLight1" | "cyanBright" | "cyan" | "cyanDark1" | "grayLight2" | "grayLight1" | "grayBright" | "gray" | "grayDark1" | "greenLight2" | "greenLight1" | "greenBright" | "green" | "greenDark1" | "orangeLight2" | "orangeLight1" | "orangeBright" | "orange" | "orangeDark1" | "pinkLight2" | "pinkLight1" | "pinkBright" | "pink" | "pinkDark1" | "purpleLight2" | "purpleLight1" | "purpleBright" | "purple" | "purpleDark1" | "redLight2" | "redLight1" | "redBright" | "red" | "redDark1" | "tealLight2" | "tealLight1" | "tealBright" | "teal" | "tealDark1" | "yellowLight2" | "yellowLight1" | "yellowBright" | "yellow" | "yellowDark1";
                    })[];
                  defaultValue?: string | string[];
                  preventAutoNewOptions?: boolean;
                }) | ({
                  /** @description Only be used in number field (number field or formula / rollup field with cellValueType equals Number */
                  formatting?: {
                    precision: number;
                    /** @enum {string} */
                    type: "decimal";
                  } | {
                    precision: number;
                    /** @enum {string} */
                    type: "percent";
                  } | {
                    precision: number;
                    /** @enum {string} */
                    type: "currency";
                    symbol: string;
                  };
                  /** @description Only be used in number field (number field or formula / rollup field with cellValueType equals Number */
                  showAs?: ({
                    /**
                     * @description can display as bar or ring in number field with single cellValue value
                     * @enum {string}
                     */
                    type: "bar" | "ring";
                    /** @enum {string} */
                    color: "blueLight2" | "blueLight1" | "blueBright" | "blue" | "blueDark1" | "cyanLight2" | "cyanLight1" | "cyanBright" | "cyan" | "cyanDark1" | "grayLight2" | "grayLight1" | "grayBright" | "gray" | "grayDark1" | "greenLight2" | "greenLight1" | "greenBright" | "green" | "greenDark1" | "orangeLight2" | "orangeLight1" | "orangeBright" | "orange" | "orangeDark1" | "pinkLight2" | "pinkLight1" | "pinkBright" | "pink" | "pinkDark1" | "purpleLight2" | "purpleLight1" | "purpleBright" | "purple" | "purpleDark1" | "redLight2" | "redLight1" | "redBright" | "red" | "redDark1" | "tealLight2" | "tealLight1" | "tealBright" | "teal" | "tealDark1" | "yellowLight2" | "yellowLight1" | "yellowBright" | "yellow" | "yellowDark1";
                    /** @description whether to displays the specific value on the graph */
                    showValue: boolean;
                    /** @description the value that represents a 100% maximum value, it does not represent a hard limit on the value */
                    maxValue: number;
                  }) | ({
                    /**
                     * @description can display as bar or line in number field with multiple cellValue value
                     * @enum {string}
                     */
                    type: "bar" | "line";
                    /** @enum {string} */
                    color: "blueLight2" | "blueLight1" | "blueBright" | "blue" | "blueDark1" | "cyanLight2" | "cyanLight1" | "cyanBright" | "cyan" | "cyanDark1" | "grayLight2" | "grayLight1" | "grayBright" | "gray" | "grayDark1" | "greenLight2" | "greenLight1" | "greenBright" | "green" | "greenDark1" | "orangeLight2" | "orangeLight1" | "orangeBright" | "orange" | "orangeDark1" | "pinkLight2" | "pinkLight1" | "pinkBright" | "pink" | "pinkDark1" | "purpleLight2" | "purpleLight1" | "purpleBright" | "purple" | "purpleDark1" | "redLight2" | "redLight1" | "redBright" | "red" | "redDark1" | "tealLight2" | "tealLight1" | "tealBright" | "teal" | "tealDark1" | "yellowLight2" | "yellowLight1" | "yellowBright" | "yellow" | "yellowDark1";
                  });
                  defaultValue?: number;
                }) | ({
                  /** @description caveat: the formatting is just a formatter, it dose not effect the storing value of the record */
                  formatting: {
                    /** @description the display formatting of the date. you can use the following presets: M/D/YYYY, D/M/YYYY, YYYY/MM/DD, YYYY-MM-DD, YYYY-MM, MM-DD, YYYY, MM, DD */
                    date: string;
                    /**
                     * @description the display formatting of the time. you can use the following presets: HH:mm, hh:mm A, None
                     * @enum {string}
                     */
                    time: "HH:mm" | "hh:mm A" | "None";
                    /** @description The time zone that should be used to format dates */
                    timeZone: string;
                  };
                });
                /** @description The AI configuration of the field. */
                aiConfig?: unknown;
                /**
                 * @description The id of the field that start with "fld", followed by exactly 16 alphanumeric characters `/^fld[\da-zA-Z]{16}$/`. It is sometimes useful to specify an id at creation time
                 * @example fldxxxxxxxxxxxxxxxx
                 */
                id?: string;
                order?: {
                  /** @description You can only specify order in one view when create field */
                  viewId: string;
                  orderIndex: number;
                };
              })[];
            /** @description The views of the table. If it is empty, a grid view will be generated by default. */
            views?: ({
                name?: string;
                /** @enum {string} */
                type: "grid" | "calendar" | "kanban" | "form" | "gallery" | "plugin";
                description?: string;
                order?: number;
                options?: ({
                  /**
                   * @description The row height level of row in view
                   * @enum {string}
                   */
                  rowHeight?: "short" | "medium" | "tall" | "extraTall" | "autoFit";
                  /** @description The field name display lines in view */
                  fieldNameDisplayLines?: number;
                  /** @description The frozen column count in view */
                  frozenColumnCount?: number;
                }) | ({
                  /** @description The field id of the Kanban stack. */
                  stackFieldId?: string;
                  /** @description The cover field id is a designated attachment field id, the contents of which appear at the top of each Kanban card. */
                  coverFieldId?: string | null;
                  /** @description If true, cover images are resized to fit Kanban cards. */
                  isCoverFit?: boolean;
                  /** @description If true, hides field name in the Kanban cards. */
                  isFieldNameHidden?: boolean;
                  /** @description If true, hides empty stacks in the Kanban. */
                  isEmptyStackHidden?: boolean;
                }) | ({
                  /** @description The cover field id is a designated attachment field id, the contents of which appear at the top of each gallery card. */
                  coverFieldId?: string | null;
                  /** @description If true, cover images are resized to fit gallery cards. */
                  isCoverFit?: boolean;
                  /** @description If true, hides field name in the gallery cards. */
                  isFieldNameHidden?: boolean;
                }) | ({
                  /** @description The start date field id. */
                  startDateFieldId?: string | null;
                  /** @description The end date field id. */
                  endDateFieldId?: string | null;
                  /** @description The title field id. */
                  titleFieldId?: string | null;
                  colorConfig?: ({
                    /** @enum {string} */
                    type: "field" | "custom";
                    /** @description The color field id. */
                    fieldId?: string | null;
                    /**
                     * @description The color.
                     * @enum {string|null}
                     */
                    color?: "blueLight2" | "blueLight1" | "blueBright" | "blue" | "blueDark1" | "cyanLight2" | "cyanLight1" | "cyanBright" | "cyan" | "cyanDark1" | "grayLight2" | "grayLight1" | "grayBright" | "gray" | "grayDark1" | "greenLight2" | "greenLight1" | "greenBright" | "green" | "greenDark1" | "orangeLight2" | "orangeLight1" | "orangeBright" | "orange" | "orangeDark1" | "pinkLight2" | "pinkLight1" | "pinkBright" | "pink" | "pinkDark1" | "purpleLight2" | "purpleLight1" | "purpleBright" | "purple" | "purpleDark1" | "redLight2" | "redLight1" | "redBright" | "red" | "redDark1" | "tealLight2" | "tealLight1" | "tealBright" | "teal" | "tealDark1" | "yellowLight2" | "yellowLight1" | "yellowBright" | "yellow" | "yellowDark1" | null;
                  }) | null;
                }) | {
                  /** @description The cover url of the form */
                  coverUrl?: string;
                  /** @description The logo url of the form */
                  logoUrl?: string;
                  /** @description The submit button text of the form */
                  submitLabel?: string;
                } | {
                  /** @description The plugin id */
                  pluginId: string;
                  /** @description The plugin install id */
                  pluginInstallId: string;
                  /** @description The plugin logo */
                  pluginLogo: string;
                };
                sort?: ({
                  sortObjs: ({
                      /** @description The id of the field. */
                      fieldId: string;
                      /** @enum {string} */
                      order: "asc" | "desc";
                    })[];
                  manualSort?: boolean;
                }) | null;
                /** @description A filter object for complex query conditions based on fields, operators, and values. Use our visual query builder at https://app.teable.ai/developer/tool/query-builder to build filters. */
                filter?: Record<string, never>;
                group?: (({
                    /** @description The id of the field. */
                    fieldId: string;
                    /** @enum {string} */
                    order: "asc" | "desc";
                  })[]) | null;
                isLocked?: boolean;
                shareId?: string;
                enableShare?: boolean;
                shareMeta?: {
                  allowCopy?: boolean;
                  includeHiddenField?: boolean;
                  password?: string;
                  includeRecords?: boolean;
                  submit?: {
                    allow?: boolean;
                    requireLogin?: boolean;
                  };
                };
                /** @description A mapping of view IDs to their corresponding column metadata. */
                columnMeta?: {
                  [key: string]: ({
                    /** @description Order is a floating number, column will sort by it in the view. */
                    order: number;
                    /** @description Column width in the view. */
                    width?: number;
                    /** @description If column hidden in the view. */
                    hidden?: boolean;
                    /**
                     * @description Statistic function of the column in the view.
                     * @enum {string|null}
                     */
                    statisticFunc?: "count" | "empty" | "filled" | "unique" | "max" | "min" | "sum" | "average" | "checked" | "unChecked" | "percentEmpty" | "percentFilled" | "percentUnique" | "percentChecked" | "percentUnChecked" | "earliestDate" | "latestDate" | "dateRangeOfDays" | "dateRangeOfMonths" | "totalAttachmentSize" | null;
                  }) | {
                    /** @description Order is a floating number, column will sort by it in the view. */
                    order: number;
                    /** @description If column visible in the kanban view. */
                    visible?: boolean;
                  } | {
                    /** @description Order is a floating number, column will sort by it in the view. */
                    order: number;
                    /** @description If column visible in the gallery view. */
                    visible?: boolean;
                  } | {
                    /** @description Order is a floating number, column will sort by it in the view. */
                    order: number;
                    /** @description If column visible in the view. */
                    visible?: boolean;
                    /** @description If column is required. */
                    required?: boolean;
                  } | {
                    /** @description Order is a floating number, column will sort by it in the view. */
                    order: number;
                    /** @description If column hidden in the view. */
                    hidden?: boolean;
                  };
                };
              })[];
            /**
             * @description The record data of the table. If it is empty, 3 empty records will be generated by default.
             * @example [
             *   {
             *     "fields": {
             *       "single line text": "text value"
             *     }
             *   }
             * ]
             */
            records?: {
                /** @description Objects with a fields key mapping fieldId or field name to value for that field. */
                fields: {
                  [key: string]: unknown;
                };
              }[];
            order?: number;
            /**
             * @description Define the key type of record.fields[key], You can click "systemInfo" in the field edit box to get fieldId or enter the table design screen with all the field details
             * @default name
             * @enum {string}
             */
            fieldKeyType?: "id" | "name" | "dbFieldName";
          };
        };
      };
      responses: {
        /** @description Returns data about a table. */
        201: {
          content: {
            "application/json": {
              /** @description The id of table. */
              id: string;
              /** @description The name of the table. */
              name: string;
              /** @description Table name in backend database. Limitation: 1-63 characters, start with letter, can only contain letters, numbers and underscore, case insensitive, cannot be duplicated with existing db table name in the base. */
              dbTableName: string;
              /** @description The description of the table. */
              description?: string;
              /** @description The emoji icon string of the table. */
              icon?: string;
              /** @description The fields of the table. */
              fields: ({
                  /** @description The id of the field. */
                  id: string;
                  /**
                   * @description The name of the field. can not be duplicated in the table.
                   * @example Tags
                   */
                  name: string;
                  /**
                   * @description The field types supported by teable.
                   * @example singleSelect
                   * @enum {string}
                   */
                  type: "singleLineText" | "longText" | "user" | "attachment" | "checkbox" | "multipleSelect" | "singleSelect" | "date" | "number" | "rating" | "formula" | "rollup" | "link" | "createdTime" | "lastModifiedTime" | "createdBy" | "lastModifiedBy" | "autoNumber" | "button" | "department" | "createdByDepartment" | "lastModifiedByDepartment";
                  /**
                   * @description The description of the field.
                   * @example this is a summary
                   */
                  description?: string;
                  /** @description The configuration options of the field. The structure of the field's options depend on the field's type. */
                  options: ({
                    /** @enum {string} */
                    expression: "countall({values})" | "counta({values})" | "count({values})" | "sum({values})" | "max({values})" | "min({values})" | "and({values})" | "or({values})" | "xor({values})" | "array_join({values})" | "array_unique({values})" | "array_compact({values})" | "concatenate({values})";
                    /** @description The time zone that should be used to format dates */
                    timeZone?: string;
                    /** @description Different cell value types are determined based on the results of expression parsing, where numbers, dates, and formatting options are provided */
                    formatting?: ({
                      /** @description the display formatting of the date. you can use the following presets: M/D/YYYY, D/M/YYYY, YYYY/MM/DD, YYYY-MM-DD, YYYY-MM, MM-DD, YYYY, MM, DD */
                      date: string;
                      /**
                       * @description the display formatting of the time. you can use the following presets: HH:mm, hh:mm A, None
                       * @enum {string}
                       */
                      time: "HH:mm" | "hh:mm A" | "None";
                      /** @description The time zone that should be used to format dates */
                      timeZone: string;
                    }) | {
                      precision: number;
                      /** @enum {string} */
                      type: "decimal";
                    } | {
                      precision: number;
                      /** @enum {string} */
                      type: "percent";
                    } | {
                      precision: number;
                      /** @enum {string} */
                      type: "currency";
                      symbol: string;
                    };
                    /** @description According to the results of expression parsing to determine different visual effects, where strings, numbers will provide customized "show as" */
                    showAs?: ({
                      /**
                       * @description can display as url, email or phone in string field with a button to perform the corresponding action, start a phone call, send an email, or open a link in a new tab
                       * @enum {string}
                       */
                      type: "url" | "email" | "phone";
                    }) | ({
                      /**
                       * @description can display as bar or ring in number field with single cellValue value
                       * @enum {string}
                       */
                      type: "bar" | "ring";
                      /** @enum {string} */
                      color: "blueLight2" | "blueLight1" | "blueBright" | "blue" | "blueDark1" | "cyanLight2" | "cyanLight1" | "cyanBright" | "cyan" | "cyanDark1" | "grayLight2" | "grayLight1" | "grayBright" | "gray" | "grayDark1" | "greenLight2" | "greenLight1" | "greenBright" | "green" | "greenDark1" | "orangeLight2" | "orangeLight1" | "orangeBright" | "orange" | "orangeDark1" | "pinkLight2" | "pinkLight1" | "pinkBright" | "pink" | "pinkDark1" | "purpleLight2" | "purpleLight1" | "purpleBright" | "purple" | "purpleDark1" | "redLight2" | "redLight1" | "redBright" | "red" | "redDark1" | "tealLight2" | "tealLight1" | "tealBright" | "teal" | "tealDark1" | "yellowLight2" | "yellowLight1" | "yellowBright" | "yellow" | "yellowDark1";
                      /** @description whether to displays the specific value on the graph */
                      showValue: boolean;
                      /** @description the value that represents a 100% maximum value, it does not represent a hard limit on the value */
                      maxValue: number;
                    }) | ({
                      /**
                       * @description can display as bar or line in number field with multiple cellValue value
                       * @enum {string}
                       */
                      type: "bar" | "line";
                      /** @enum {string} */
                      color: "blueLight2" | "blueLight1" | "blueBright" | "blue" | "blueDark1" | "cyanLight2" | "cyanLight1" | "cyanBright" | "cyan" | "cyanDark1" | "grayLight2" | "grayLight1" | "grayBright" | "gray" | "grayDark1" | "greenLight2" | "greenLight1" | "greenBright" | "green" | "greenDark1" | "orangeLight2" | "orangeLight1" | "orangeBright" | "orange" | "orangeDark1" | "pinkLight2" | "pinkLight1" | "pinkBright" | "pink" | "pinkDark1" | "purpleLight2" | "purpleLight1" | "purpleBright" | "purple" | "purpleDark1" | "redLight2" | "redLight1" | "redBright" | "red" | "redDark1" | "tealLight2" | "tealLight1" | "tealBright" | "teal" | "tealDark1" | "yellowLight2" | "yellowLight1" | "yellowBright" | "yellow" | "yellowDark1";
                    });
                  }) | ({
                    /** @description The formula including fields referenced by their IDs. For example, LEFT(4, {Birthday}) input will be returned as LEFT(4, {fldXXX}) via API. The formula syntax in Teable is basically the same as Airtable */
                    expression: string;
                    /** @description The time zone that should be used to format dates */
                    timeZone?: string;
                    /** @description Different cell value types are determined based on the results of expression parsing, where numbers, dates, and formatting options are provided */
                    formatting?: ({
                      /** @description the display formatting of the date. you can use the following presets: M/D/YYYY, D/M/YYYY, YYYY/MM/DD, YYYY-MM-DD, YYYY-MM, MM-DD, YYYY, MM, DD */
                      date: string;
                      /**
                       * @description the display formatting of the time. you can use the following presets: HH:mm, hh:mm A, None
                       * @enum {string}
                       */
                      time: "HH:mm" | "hh:mm A" | "None";
                      /** @description The time zone that should be used to format dates */
                      timeZone: string;
                    }) | {
                      precision: number;
                      /** @enum {string} */
                      type: "decimal";
                    } | {
                      precision: number;
                      /** @enum {string} */
                      type: "percent";
                    } | {
                      precision: number;
                      /** @enum {string} */
                      type: "currency";
                      symbol: string;
                    };
                    /** @description According to the results of expression parsing to determine different visual effects, where strings, numbers will provide customized "show as" */
                    showAs?: ({
                      /**
                       * @description can display as url, email or phone in string field with a button to perform the corresponding action, start a phone call, send an email, or open a link in a new tab
                       * @enum {string}
                       */
                      type: "url" | "email" | "phone";
                    }) | ({
                      /**
                       * @description can display as bar or ring in number field with single cellValue value
                       * @enum {string}
                       */
                      type: "bar" | "ring";
                      /** @enum {string} */
                      color: "blueLight2" | "blueLight1" | "blueBright" | "blue" | "blueDark1" | "cyanLight2" | "cyanLight1" | "cyanBright" | "cyan" | "cyanDark1" | "grayLight2" | "grayLight1" | "grayBright" | "gray" | "grayDark1" | "greenLight2" | "greenLight1" | "greenBright" | "green" | "greenDark1" | "orangeLight2" | "orangeLight1" | "orangeBright" | "orange" | "orangeDark1" | "pinkLight2" | "pinkLight1" | "pinkBright" | "pink" | "pinkDark1" | "purpleLight2" | "purpleLight1" | "purpleBright" | "purple" | "purpleDark1" | "redLight2" | "redLight1" | "redBright" | "red" | "redDark1" | "tealLight2" | "tealLight1" | "tealBright" | "teal" | "tealDark1" | "yellowLight2" | "yellowLight1" | "yellowBright" | "yellow" | "yellowDark1";
                      /** @description whether to displays the specific value on the graph */
                      showValue: boolean;
                      /** @description the value that represents a 100% maximum value, it does not represent a hard limit on the value */
                      maxValue: number;
                    }) | ({
                      /**
                       * @description can display as bar or line in number field with multiple cellValue value
                       * @enum {string}
                       */
                      type: "bar" | "line";
                      /** @enum {string} */
                      color: "blueLight2" | "blueLight1" | "blueBright" | "blue" | "blueDark1" | "cyanLight2" | "cyanLight1" | "cyanBright" | "cyan" | "cyanDark1" | "grayLight2" | "grayLight1" | "grayBright" | "gray" | "grayDark1" | "greenLight2" | "greenLight1" | "greenBright" | "green" | "greenDark1" | "orangeLight2" | "orangeLight1" | "orangeBright" | "orange" | "orangeDark1" | "pinkLight2" | "pinkLight1" | "pinkBright" | "pink" | "pinkDark1" | "purpleLight2" | "purpleLight1" | "purpleBright" | "purple" | "purpleDark1" | "redLight2" | "redLight1" | "redBright" | "red" | "redDark1" | "tealLight2" | "tealLight1" | "tealBright" | "teal" | "tealDark1" | "yellowLight2" | "yellowLight1" | "yellowBright" | "yellow" | "yellowDark1";
                    });
                  }) | ({
                    /** @description the base id of the table that this field is linked to, only required for cross base link */
                    baseId?: string;
                    /**
                     * @description describe the relationship from this table to the foreign table
                     * @enum {string}
                     */
                    relationship: "oneOne" | "manyMany" | "oneMany" | "manyOne";
                    /** @description the table this field is linked to */
                    foreignTableId: string;
                    /** @description the field in the foreign table that will be displayed as the current field */
                    lookupFieldId: string;
                    /** @description whether the field is a one-way link, when true, it will not generate a symmetric field, it is generally has better performance */
                    isOneWay?: boolean;
                    /** @description the table name for storing keys, in many-to-many relationships, keys are stored in a separate intermediate table; in other relationships, keys are stored on one side as needed */
                    fkHostTableName: string;
                    /** @description the name of the field that stores the current table primary key */
                    selfKeyName: string;
                    /** @description The name of the field that stores the foreign table primary key */
                    foreignKeyName: string;
                    /** @description the symmetric field in the foreign table, empty if the field is a one-way link */
                    symmetricFieldId?: string;
                    /** @description the view id that limits the number of records in the link field */
                    filterByViewId?: string | null;
                    /** @description the fields that will be displayed in the link field */
                    visibleFieldIds?: string[] | null;
                    /** @description A filter object for complex query conditions based on fields, operators, and values. Use our visual query builder at https://app.teable.ai/developer/tool/query-builder to build filters. */
                    filter?: Record<string, never>;
                  }) | ({
                    /** @description caveat: the formatting is just a formatter, it dose not effect the storing value of the record */
                    formatting: {
                      /** @description the display formatting of the date. you can use the following presets: M/D/YYYY, D/M/YYYY, YYYY/MM/DD, YYYY-MM-DD, YYYY-MM, MM-DD, YYYY, MM, DD */
                      date: string;
                      /**
                       * @description the display formatting of the time. you can use the following presets: HH:mm, hh:mm A, None
                       * @enum {string}
                       */
                      time: "HH:mm" | "hh:mm A" | "None";
                      /** @description The time zone that should be used to format dates */
                      timeZone: string;
                    };
                    /**
                     * @description Whether the new row is automatically filled with the current time, caveat: the defaultValue is just a flag, it dose not effect the storing value of the record
                     * @enum {string}
                     */
                    defaultValue?: "now";
                  }) | {
                    defaultValue?: boolean;
                  } | Record<string, never> | ({
                    /** @description Only be used in single line text field or formula / rollup field with cellValueType equals String and isMultipleCellValue is not true */
                    showAs?: {
                      /**
                       * @description can display as url, email or phone in string field with a button to perform the corresponding action, start a phone call, send an email, or open a link in a new tab
                       * @enum {string}
                       */
                      type: "url" | "email" | "phone";
                    };
                    defaultValue?: string;
                  }) | ({
                    /** @enum {string} */
                    icon: "star" | "moon" | "sun" | "zap" | "flame" | "heart" | "apple" | "thumb-up";
                    /** @enum {string} */
                    color: "yellowBright" | "redBright" | "tealBright";
                    max: number;
                  }) | ({
                    /** @description Allow adding multiple users */
                    isMultiple?: boolean;
                    /** @description Notify users when their name is added to a cell */
                    shouldNotify?: boolean;
                    defaultValue?: string | "me" | ((string | "me")[]);
                  }) | ({
                    /** @description Button label */
                    label: string;
                    /**
                     * @description Button color
                     * @enum {string}
                     */
                    color: "blueLight2" | "blueLight1" | "blueBright" | "blue" | "blueDark1" | "cyanLight2" | "cyanLight1" | "cyanBright" | "cyan" | "cyanDark1" | "grayLight2" | "grayLight1" | "grayBright" | "gray" | "grayDark1" | "greenLight2" | "greenLight1" | "greenBright" | "green" | "greenDark1" | "orangeLight2" | "orangeLight1" | "orangeBright" | "orange" | "orangeDark1" | "pinkLight2" | "pinkLight1" | "pinkBright" | "pink" | "pinkDark1" | "purpleLight2" | "purpleLight1" | "purpleBright" | "purple" | "purpleDark1" | "redLight2" | "redLight1" | "redBright" | "red" | "redDark1" | "tealLight2" | "tealLight1" | "tealBright" | "teal" | "tealDark1" | "yellowLight2" | "yellowLight1" | "yellowBright" | "yellow" | "yellowDark1";
                    /** @description Max count of button clicks */
                    maxCount?: number;
                    /** @description Reset count */
                    resetCount?: boolean;
                    /** @description Workflow */
                    workflow?: {
                      /** @description Workflow ID */
                      id?: string;
                      /** @description Workflow Name */
                      name?: string;
                      /** @description Workflow is active */
                      isActive?: boolean;
                    } | null;
                  }) | ({
                    choices: ({
                        id: string;
                        name: string;
                        /** @enum {string} */
                        color: "blueLight2" | "blueLight1" | "blueBright" | "blue" | "blueDark1" | "cyanLight2" | "cyanLight1" | "cyanBright" | "cyan" | "cyanDark1" | "grayLight2" | "grayLight1" | "grayBright" | "gray" | "grayDark1" | "greenLight2" | "greenLight1" | "greenBright" | "green" | "greenDark1" | "orangeLight2" | "orangeLight1" | "orangeBright" | "orange" | "orangeDark1" | "pinkLight2" | "pinkLight1" | "pinkBright" | "pink" | "pinkDark1" | "purpleLight2" | "purpleLight1" | "purpleBright" | "purple" | "purpleDark1" | "redLight2" | "redLight1" | "redBright" | "red" | "redDark1" | "tealLight2" | "tealLight1" | "tealBright" | "teal" | "tealDark1" | "yellowLight2" | "yellowLight1" | "yellowBright" | "yellow" | "yellowDark1";
                      })[];
                    defaultValue?: string | string[];
                    preventAutoNewOptions?: boolean;
                  }) | ({
                    /** @description Only be used in number field (number field or formula / rollup field with cellValueType equals Number */
                    formatting: {
                      precision: number;
                      /** @enum {string} */
                      type: "decimal";
                    } | {
                      precision: number;
                      /** @enum {string} */
                      type: "percent";
                    } | {
                      precision: number;
                      /** @enum {string} */
                      type: "currency";
                      symbol: string;
                    };
                    /** @description Only be used in number field (number field or formula / rollup field with cellValueType equals Number */
                    showAs?: ({
                      /**
                       * @description can display as bar or ring in number field with single cellValue value
                       * @enum {string}
                       */
                      type: "bar" | "ring";
                      /** @enum {string} */
                      color: "blueLight2" | "blueLight1" | "blueBright" | "blue" | "blueDark1" | "cyanLight2" | "cyanLight1" | "cyanBright" | "cyan" | "cyanDark1" | "grayLight2" | "grayLight1" | "grayBright" | "gray" | "grayDark1" | "greenLight2" | "greenLight1" | "greenBright" | "green" | "greenDark1" | "orangeLight2" | "orangeLight1" | "orangeBright" | "orange" | "orangeDark1" | "pinkLight2" | "pinkLight1" | "pinkBright" | "pink" | "pinkDark1" | "purpleLight2" | "purpleLight1" | "purpleBright" | "purple" | "purpleDark1" | "redLight2" | "redLight1" | "redBright" | "red" | "redDark1" | "tealLight2" | "tealLight1" | "tealBright" | "teal" | "tealDark1" | "yellowLight2" | "yellowLight1" | "yellowBright" | "yellow" | "yellowDark1";
                      /** @description whether to displays the specific value on the graph */
                      showValue: boolean;
                      /** @description the value that represents a 100% maximum value, it does not represent a hard limit on the value */
                      maxValue: number;
                    }) | ({
                      /**
                       * @description can display as bar or line in number field with multiple cellValue value
                       * @enum {string}
                       */
                      type: "bar" | "line";
                      /** @enum {string} */
                      color: "blueLight2" | "blueLight1" | "blueBright" | "blue" | "blueDark1" | "cyanLight2" | "cyanLight1" | "cyanBright" | "cyan" | "cyanDark1" | "grayLight2" | "grayLight1" | "grayBright" | "gray" | "grayDark1" | "greenLight2" | "greenLight1" | "greenBright" | "green" | "greenDark1" | "orangeLight2" | "orangeLight1" | "orangeBright" | "orange" | "orangeDark1" | "pinkLight2" | "pinkLight1" | "pinkBright" | "pink" | "pinkDark1" | "purpleLight2" | "purpleLight1" | "purpleBright" | "purple" | "purpleDark1" | "redLight2" | "redLight1" | "redBright" | "red" | "redDark1" | "tealLight2" | "tealLight1" | "tealBright" | "teal" | "tealDark1" | "yellowLight2" | "yellowLight1" | "yellowBright" | "yellow" | "yellowDark1";
                    });
                    defaultValue?: number;
                  }) | {
                    /** @enum {string} */
                    expression: "AUTO_NUMBER()";
                  } | ({
                    /** @enum {string} */
                    expression: "CREATED_TIME()";
                    /** @description caveat: the formatting is just a formatter, it dose not effect the storing value of the record */
                    formatting: {
                      /** @description the display formatting of the date. you can use the following presets: M/D/YYYY, D/M/YYYY, YYYY/MM/DD, YYYY-MM-DD, YYYY-MM, MM-DD, YYYY, MM, DD */
                      date: string;
                      /**
                       * @description the display formatting of the time. you can use the following presets: HH:mm, hh:mm A, None
                       * @enum {string}
                       */
                      time: "HH:mm" | "hh:mm A" | "None";
                      /** @description The time zone that should be used to format dates */
                      timeZone: string;
                    };
                  }) | ({
                    /** @enum {string} */
                    expression: "LAST_MODIFIED_TIME()";
                    /** @description caveat: the formatting is just a formatter, it dose not effect the storing value of the record */
                    formatting: {
                      /** @description the display formatting of the date. you can use the following presets: M/D/YYYY, D/M/YYYY, YYYY/MM/DD, YYYY-MM-DD, YYYY-MM, MM-DD, YYYY, MM, DD */
                      date: string;
                      /**
                       * @description the display formatting of the time. you can use the following presets: HH:mm, hh:mm A, None
                       * @enum {string}
                       */
                      time: "HH:mm" | "hh:mm A" | "None";
                      /** @description The time zone that should be used to format dates */
                      timeZone: string;
                    };
                  });
                  /** @description The AI configuration of the field. */
                  aiConfig?: unknown;
                  /** @description Whether this field is lookup field. witch means cellValue and [fieldType] is looked up from the linked table. */
                  isLookup?: boolean;
                  /** @description field lookup options. */
                  lookupOptions?: {
                    /** @description the table this field is linked to */
                    foreignTableId: string;
                    /** @description the field in the foreign table that will be displayed as the current field */
                    lookupFieldId: string;
                    /**
                     * @description describe the relationship from this table to the foreign table
                     * @enum {string}
                     */
                    relationship: "oneOne" | "manyMany" | "oneMany" | "manyOne";
                    /** @description the table name for storing keys, in many-to-many relationships, keys are stored in a separate intermediate table; in other relationships, keys are stored on one side as needed */
                    fkHostTableName: string;
                    /** @description the name of the field that stores the current table primary key */
                    selfKeyName: string;
                    /** @description The name of the field that stores the foreign table primary key */
                    foreignKeyName: string;
                    /** @description A filter object for complex query conditions based on fields, operators, and values. Use our visual query builder at https://app.teable.ai/developer/tool/query-builder to build filters. */
                    filter?: Record<string, never>;
                    /** @description The id of Linked record field to use for lookup */
                    linkFieldId: string;
                  };
                  /** @description Whether this field is not null. */
                  notNull?: boolean;
                  /** @description Whether this field is not unique. */
                  unique?: boolean;
                  /** @description Whether this field is primary field. */
                  isPrimary?: boolean;
                  /** @description Whether this field is computed field, you can not modify cellValue in computed field. */
                  isComputed?: boolean;
                  /** @description Whether this field's calculation is pending. */
                  isPending?: boolean;
                  /** @description Whether This field has a configuration error. Check the fields referenced by this field's formula or configuration. */
                  hasError?: boolean;
                  /**
                   * @description The cell value type of the field.
                   * @enum {string}
                   */
                  cellValueType: "string" | "number" | "boolean" | "dateTime";
                  /** @description Whether this field has multiple cell value. */
                  isMultipleCellValue?: boolean;
                  /**
                   * @description The field type of database that cellValue really store.
                   * @enum {string}
                   */
                  dbFieldType: "TEXT" | "INTEGER" | "DATETIME" | "REAL" | "BLOB" | "JSON" | "BOOLEAN";
                  /** @description Field(column) name in backend database. Limitation: 1-63 characters, can only contain letters, numbers and underscore, case sensitive, cannot be duplicated with existing db field name in the table. */
                  dbFieldName: string;
                  /** @description Field record read permission. When set to false, reading records is denied. When true or not set, reading records is allowed. */
                  recordRead?: boolean;
                  /** @description Field record create permission. When set to false, creating records is denied. When true or not set, creating records is allowed. */
                  recordCreate?: boolean;
                })[];
              /** @description The views of the table. */
              views: ({
                  id: string;
                  name: string;
                  /** @enum {string} */
                  type: "grid" | "calendar" | "kanban" | "form" | "gallery" | "plugin";
                  description?: string;
                  order?: number;
                  options?: ({
                    /**
                     * @description The row height level of row in view
                     * @enum {string}
                     */
                    rowHeight?: "short" | "medium" | "tall" | "extraTall" | "autoFit";
                    /** @description The field name display lines in view */
                    fieldNameDisplayLines?: number;
                    /** @description The frozen column count in view */
                    frozenColumnCount?: number;
                  }) | ({
                    /** @description The field id of the Kanban stack. */
                    stackFieldId?: string;
                    /** @description The cover field id is a designated attachment field id, the contents of which appear at the top of each Kanban card. */
                    coverFieldId?: string | null;
                    /** @description If true, cover images are resized to fit Kanban cards. */
                    isCoverFit?: boolean;
                    /** @description If true, hides field name in the Kanban cards. */
                    isFieldNameHidden?: boolean;
                    /** @description If true, hides empty stacks in the Kanban. */
                    isEmptyStackHidden?: boolean;
                  }) | ({
                    /** @description The cover field id is a designated attachment field id, the contents of which appear at the top of each gallery card. */
                    coverFieldId?: string | null;
                    /** @description If true, cover images are resized to fit gallery cards. */
                    isCoverFit?: boolean;
                    /** @description If true, hides field name in the gallery cards. */
                    isFieldNameHidden?: boolean;
                  }) | ({
                    /** @description The start date field id. */
                    startDateFieldId?: string | null;
                    /** @description The end date field id. */
                    endDateFieldId?: string | null;
                    /** @description The title field id. */
                    titleFieldId?: string | null;
                    colorConfig?: ({
                      /** @enum {string} */
                      type: "field" | "custom";
                      /** @description The color field id. */
                      fieldId?: string | null;
                      /**
                       * @description The color.
                       * @enum {string|null}
                       */
                      color?: "blueLight2" | "blueLight1" | "blueBright" | "blue" | "blueDark1" | "cyanLight2" | "cyanLight1" | "cyanBright" | "cyan" | "cyanDark1" | "grayLight2" | "grayLight1" | "grayBright" | "gray" | "grayDark1" | "greenLight2" | "greenLight1" | "greenBright" | "green" | "greenDark1" | "orangeLight2" | "orangeLight1" | "orangeBright" | "orange" | "orangeDark1" | "pinkLight2" | "pinkLight1" | "pinkBright" | "pink" | "pinkDark1" | "purpleLight2" | "purpleLight1" | "purpleBright" | "purple" | "purpleDark1" | "redLight2" | "redLight1" | "redBright" | "red" | "redDark1" | "tealLight2" | "tealLight1" | "tealBright" | "teal" | "tealDark1" | "yellowLight2" | "yellowLight1" | "yellowBright" | "yellow" | "yellowDark1" | null;
                    }) | null;
                  }) | {
                    /** @description The cover url of the form */
                    coverUrl?: string;
                    /** @description The logo url of the form */
                    logoUrl?: string;
                    /** @description The submit button text of the form */
                    submitLabel?: string;
                  } | {
                    /** @description The plugin id */
                    pluginId: string;
                    /** @description The plugin install id */
                    pluginInstallId: string;
                    /** @description The plugin logo */
                    pluginLogo: string;
                  };
                  sort?: ({
                    sortObjs: ({
                        /** @description The id of the field. */
                        fieldId: string;
                        /** @enum {string} */
                        order: "asc" | "desc";
                      })[];
                    manualSort?: boolean;
                  }) | null;
                  /** @description A filter object for complex query conditions based on fields, operators, and values. Use our visual query builder at https://app.teable.ai/developer/tool/query-builder to build filters. */
                  filter?: Record<string, never>;
                  group?: (({
                      /** @description The id of the field. */
                      fieldId: string;
                      /** @enum {string} */
                      order: "asc" | "desc";
                    })[]) | null;
                  isLocked?: boolean;
                  shareId?: string;
                  enableShare?: boolean;
                  shareMeta?: {
                    allowCopy?: boolean;
                    includeHiddenField?: boolean;
                    password?: string;
                    includeRecords?: boolean;
                    submit?: {
                      allow?: boolean;
                      requireLogin?: boolean;
                    };
                  };
                  createdBy: string;
                  lastModifiedBy?: string;
                  createdTime: string;
                  lastModifiedTime?: string;
                  /** @description A mapping of view IDs to their corresponding column metadata. */
                  columnMeta: {
                    [key: string]: ({
                      /** @description Order is a floating number, column will sort by it in the view. */
                      order: number;
                      /** @description Column width in the view. */
                      width?: number;
                      /** @description If column hidden in the view. */
                      hidden?: boolean;
                      /**
                       * @description Statistic function of the column in the view.
                       * @enum {string|null}
                       */
                      statisticFunc?: "count" | "empty" | "filled" | "unique" | "max" | "min" | "sum" | "average" | "checked" | "unChecked" | "percentEmpty" | "percentFilled" | "percentUnique" | "percentChecked" | "percentUnChecked" | "earliestDate" | "latestDate" | "dateRangeOfDays" | "dateRangeOfMonths" | "totalAttachmentSize" | null;
                    }) | {
                      /** @description Order is a floating number, column will sort by it in the view. */
                      order: number;
                      /** @description If column visible in the kanban view. */
                      visible?: boolean;
                    } | {
                      /** @description Order is a floating number, column will sort by it in the view. */
                      order: number;
                      /** @description If column visible in the gallery view. */
                      visible?: boolean;
                    } | {
                      /** @description Order is a floating number, column will sort by it in the view. */
                      order: number;
                      /** @description If column visible in the view. */
                      visible?: boolean;
                      /** @description If column is required. */
                      required?: boolean;
                    } | {
                      /** @description Order is a floating number, column will sort by it in the view. */
                      order: number;
                      /** @description If column hidden in the view. */
                      hidden?: boolean;
                    };
                  };
                  pluginId?: string;
                })[];
              /** @description The records of the table. */
              records: {
                  /** @description The record id. */
                  id: string;
                  /** @description primary field value */
                  name?: string;
                  /** @description Objects with a fields key mapping fieldId or field name to value for that field. */
                  fields: {
                    [key: string]: unknown;
                  };
                  /** @description Auto number, a unique identifier for each record */
                  autoNumber?: number;
                  /** @description Created time, date ISO string (new Date().toISOString). */
                  createdTime?: string;
                  /** @description Last modified time, date ISO string (new Date().toISOString). */
                  lastModifiedTime?: string;
                  /** @description Created by, user name */
                  createdBy?: string;
                  /** @description Last modified by, user name */
                  lastModifiedBy?: string;
                  /** @description Permissions for the record */
                  permissions?: {
                    [key: string]: {
                      [key: string]: boolean;
                    };
                  };
                  /** @description Whether the record is undeletable */
                  undeletable?: boolean;
                }[];
              order?: number;
              /** @description The last modified time of the table. */
              lastModifiedTime?: string;
              /** @description The default view id of the table. */
              defaultViewId?: string;
            };
          };
        };
      };
    };
  };
  "/base/{baseId}/table/{tableId}": {
    /**
     * Get table details
     * @description Retrieve detailed information about a specific table, including its schema, name, and configuration.
     */
    get: {
      parameters: {
        path: {
          baseId: string;
          tableId: string;
        };
      };
      responses: {
        /** @description Returns data about a table. */
        200: {
          content: {
            "application/json": {
              /** @description The id of table. */
              id: string;
              /** @description The name of the table. */
              name: string;
              /** @description Table name in backend database. Limitation: 1-63 characters, start with letter, can only contain letters, numbers and underscore, case insensitive, cannot be duplicated with existing db table name in the base. */
              dbTableName: string;
              /** @description The description of the table. */
              description?: string;
              /** @description The emoji icon string of the table. */
              icon?: string;
              order?: number;
              /** @description The last modified time of the table. */
              lastModifiedTime?: string;
              /** @description The default view id of the table. */
              defaultViewId?: string;
            };
          };
        };
      };
    };
    /**
     * Delete table
     * @description Move a table to trash. The table can be restored within the retention period.
     */
    delete: {
      parameters: {
        path: {
          baseId: string;
          tableId: string;
        };
      };
      responses: {
        /** @description Table successfully moved to trash. */
        200: {
          content: never;
        };
      };
    };
  };
  "/base/{baseId}/table": {
    /**
     * List tables
     * @description Retrieve a list of all tables in the specified base, including their basic information and configurations.
     */
    get: {
      parameters: {
        path: {
          baseId: string;
        };
      };
      responses: {
        /** @description Successfully retrieved the list of tables. */
        200: {
          content: {
            "application/json": {
                /** @description The id of table. */
                id: string;
                /** @description The name of the table. */
                name: string;
                /** @description Table name in backend database. Limitation: 1-63 characters, start with letter, can only contain letters, numbers and underscore, case insensitive, cannot be duplicated with existing db table name in the base. */
                dbTableName: string;
                /** @description The description of the table. */
                description?: string;
                /** @description The emoji icon string of the table. */
                icon?: string;
                order?: number;
                /** @description The last modified time of the table. */
                lastModifiedTime?: string;
                /** @description The default view id of the table. */
                defaultViewId?: string;
              }[];
          };
        };
      };
    };
  };
  "/base/{baseId}/table/{tableId}/permanent": {
    /**
     * Permanently delete table
     * @description Permanently delete a table and all its data. This action cannot be undone.
     */
    delete: {
      parameters: {
        path: {
          baseId: string;
          tableId: string;
        };
      };
      responses: {
        /** @description Table and all associated data permanently deleted. */
        200: {
          content: never;
        };
      };
    };
  };
  "/base/{baseId}/table/{tableId}/name": {
    /**
     * Update table name
     * @description Update the display name of a table. This will not affect the underlying database table name.
     */
    put: {
      parameters: {
        path: {
          baseId: string;
          tableId: string;
        };
      };
      requestBody?: {
        content: {
          "application/json": {
            name: string;
          };
        };
      };
      responses: {
        /** @description Table name successfully updated. */
        200: {
          content: never;
        };
      };
    };
  };
  "/base/{baseId}/table/{tableId}/icon": {
    /**
     * Update table tcon
     * @description Update the emoji icon of a table. The icon must be a valid emoji character.
     */
    put: {
      parameters: {
        path: {
          baseId: string;
          tableId: string;
        };
      };
      requestBody?: {
        content: {
          "application/json": {
            icon: string;
          };
        };
      };
      responses: {
        /** @description Table icon successfully updated. */
        200: {
          content: never;
        };
      };
    };
  };
  "/base/{baseId}/table/{tableId}/order": {
    /**
     * Update table order
     * @description Update the display order of a table in the base. This affects the order in which tables are shown in the UI.
     */
    put: {
      parameters: {
        path: {
          baseId: string;
          tableId: string;
        };
      };
      requestBody?: {
        content: {
          "application/json": {
            anchorId: string;
            /** @enum {string} */
            position: "before" | "after";
          };
        };
      };
      responses: {
        /** @description Table order successfully updated. */
        200: {
          content: never;
        };
      };
    };
  };
  "/base/{baseId}/table/{tableId}/description": {
    /**
     * Update table description
     * @description Update or remove the description of a table. Set to null to remove the description.
     */
    put: {
      parameters: {
        path: {
          baseId: string;
          tableId: string;
        };
      };
      requestBody?: {
        content: {
          "application/json": {
            description: string | null;
          };
        };
      };
      responses: {
        /** @description Table description successfully updated. */
        200: {
          content: never;
        };
      };
    };
  };
  "/base/{baseId}/table/{tableId}/db-table-name": {
    /**
     * Update db table name
     * @description Update the physical database table name. Must be 1-63 characters, start with letter or underscore, contain only letters, numbers and underscore, and be unique within the base.
     */
    put: {
      parameters: {
        path: {
          baseId: string;
          tableId: string;
        };
      };
      requestBody?: {
        content: {
          "application/json": {
            /** @description table name in backend database. Limitation: 1-63 characters, start with letter or underscore, can only contain letters, numbers and underscore, case sensitive, cannot be duplicated with existing table name in the base. */
            dbTableName: string;
          };
        };
      };
      responses: {
        /** @description Database table name successfully updated. */
        200: {
          content: never;
        };
      };
    };
  };
  "/base/{baseId}/table/{tableId}/default-view-id": {
    /**
     * Get default view id
     * @description Get default view id
     */
    get: {
      parameters: {
        path: {
          baseId: string;
          tableId: string;
        };
      };
      responses: {
        /** @description Returns default view id */
        200: {
          content: {
            "application/json": {
              id: string;
            };
          };
        };
      };
    };
  };
  "/base/{baseId}/table/{tableId}/permission": {
    /**
     * Get table permissions
     * @description Retrieve the current user's permissions for a table, including access rights for table operations, views, records, and fields.
     */
    get: {
      parameters: {
        path: {
          baseId: string;
          tableId: string;
        };
      };
      responses: {
        /** @description Successfully retrieved table permissions for the current user. */
        200: {
          content: {
            "application/json": {
              table: {
                [key: string]: boolean;
              };
              view: {
                [key: string]: boolean;
              };
              record: {
                [key: string]: boolean;
              };
              field: {
                [key: string]: boolean;
              };
            };
          };
        };
      };
    };
  };
  "/base/{baseId}/table/{tableId}/index": {
    /**
     * Toggle table index
     * @description Toggle table index
     */
    post: {
      parameters: {
        path: {
          baseId: string;
          tableId: string;
        };
      };
      requestBody?: {
        content: {
          "application/json": {
            /** @enum {string} */
            type: "search";
          };
        };
      };
      responses: {
        /** @description No return */
        201: {
          content: never;
        };
      };
    };
  };
  "/base/{baseId}/table/{tableId}/activated-index": {
    /**
     * Get activated index
     * @description Get the activated index of a table
     */
    post: {
      parameters: {
        path: {
          baseId: string;
          tableId: string;
        };
      };
      responses: {
        /** @description Returns table full text search index status */
        201: {
          content: {
            "application/json": "search"[];
          };
        };
      };
    };
  };
  "/base/{baseId}/table/{tableId}/abnormal-index": {
    /**
     * Get abnormal indexes
     * @description Retrieve a list of abnormal database indexes for a specific table by index type. This helps identify potential performance or maintenance issues.
     */
    get: {
      parameters: {
        path: {
          baseId: string;
          tableId: string;
          type: "search";
        };
      };
      responses: {
        /** @description Successfully retrieved list of abnormal indexes. */
        201: {
          content: {
            "application/json": {
                indexName: string;
              }[];
          };
        };
      };
    };
  };
  "/base/{baseId}/table/{tableId}/index/repair": {
    /**
     * Repair table index
     * @description Repair table index
     */
    patch: {
      parameters: {
        path: {
          baseId: string;
          tableId: string;
          type: "search";
        };
      };
      responses: {
        /** @description Succeed */
        201: {
          content: never;
        };
      };
    };
  };
  "/base/{baseId}/table/{tableId}/duplicate": {
    /**
     * Duplicate a table
     * @description Duplicate a table
     */
    post: {
      parameters: {
        path: {
          baseId: string;
          tableId: string;
        };
      };
      requestBody?: {
        content: {
          "application/json": {
            name: string;
            includeRecords: boolean;
          };
        };
      };
      responses: {
        /** @description Duplicate successfully */
        200: {
          content: never;
        };
      };
    };
  };
  "/table/{tableId}/selection/range-to-id": {
    /**
     * Get ids from range
     * @description Retrieve record and field identifiers based on the selected range coordinates in a table
     */
    get: {
      parameters: {
        query: {
          viewId?: string;
          ignoreViewQuery?: string | boolean;
          filterByTql?: string;
          filter?: string;
          search?: string[] | ((string | (string | boolean))[]);
          filterLinkCellCandidate?: string[] | string;
          filterLinkCellSelected?: string[] | string;
          selectedRecordIds?: string[];
          orderBy?: string;
          groupBy?: string;
          collapsedGroupIds?: string;
          queryId?: string;
          projection?: string[];
          ranges: string;
          type?: "rows" | "columns";
          returnType: "recordId" | "fieldId" | "all";
        };
        path: {
          tableId: string;
        };
      };
      responses: {
        /** @description Copy content */
        200: {
          content: {
            "application/json": {
              recordIds?: string[];
              fieldIds?: string[];
            };
          };
        };
      };
    };
  };
  "/table/{tableId}/selection/clear": {
    /**
     * Clear selected range content
     * @description Remove all content from the selected table range
     */
    patch: {
      parameters: {
        path: {
          tableId: string;
        };
      };
      requestBody?: {
        content: {
          "application/json": {
            /**
             * @description Set the view you want to fetch, default is first view. result will filter and sort by view options.
             * @example viwXXXXXXX
             */
            viewId?: string;
            /** @description When a viewId is specified, configure this to true will ignore the view's filter, sort, etc */
            ignoreViewQuery?: string | boolean;
            /**
             * @deprecated
             * @example {field} = 'Completed' AND {field} > 5
             */
            filterByTql?: string;
            /** @description A filter object for complex query conditions based on fields, operators, and values. Use our visual query builder at https://app.teable.ai/developer/tool/query-builder to build filters. */
            filter?: Record<string, never>;
            /**
             * @description Search for records that match the specified field and value
             * @default [
             *   "searchValue",
             *   "fieldIdOrName",
             *   false
             * ]
             */
            search?: string[] | ((string | (string | boolean))[]);
            /**
             * @description Filter out the records that can be selected by a given link cell from the relational table. For example, if the specified field is one to many or one to one relationship, recordId for which the field has already been selected will not appear.
             * @example [
             *   "fldXXXXXXX",
             *   "recXXXXXXX"
             * ]
             */
            filterLinkCellCandidate?: string[] | string;
            /**
             * @description Filter out selected records based on this link cell from the relational table. Note that viewId, filter, and orderBy will not take effect in this case because selected records has it own order. Ignoring recordId gets all the selected records for the field
             * @example [
             *   "fldXXXXXXX",
             *   "recXXXXXXX"
             * ]
             */
            filterLinkCellSelected?: string[] | string;
            /** @description Filter selected records by record ids */
            selectedRecordIds?: string[];
            /** @description An array of sort objects that specifies how the records should be ordered. */
            orderBy?: unknown[];
            groupBy?: (({
                /** @description The id of the field. */
                fieldId: string;
                /** @enum {string} */
                order: "asc" | "desc";
              })[]) | null;
            collapsedGroupIds?: string[];
            /**
             * @description When provided, other query parameters will be merged with the saved ones.
             * @example qry_xxxxxxxx
             */
            queryId?: string;
            /** @description If you want to get only some fields, pass in this parameter, otherwise all visible fields will be obtained */
            projection?: string[];
            /**
             * @description The parameter "ranges" is used to represent the coordinates of a selected range in a table.
             * @example [
             *   [
             *     0,
             *     0
             *   ],
             *   [
             *     1,
             *     1
             *   ]
             * ]
             */
            ranges: number[][];
            /**
             * @description Types of non-contiguous selections
             * @example columns
             * @enum {string}
             */
            type?: "rows" | "columns";
          };
        };
      };
      responses: {
        /** @description Successful clean up */
        200: {
          content: never;
        };
      };
    };
  };
  "/table/{tableId}/selection/copy": {
    /**
     * Copy selected table content
     * @description Copy content from selected table ranges including headers if specified
     */
    get: {
      parameters: {
        query: {
          viewId?: string;
          ignoreViewQuery?: string | boolean;
          filterByTql?: string;
          filter?: string;
          search?: string[] | ((string | (string | boolean))[]);
          filterLinkCellCandidate?: string[] | string;
          filterLinkCellSelected?: string[] | string;
          selectedRecordIds?: string[];
          orderBy?: string;
          groupBy?: string;
          collapsedGroupIds?: string;
          queryId?: string;
          projection?: string[];
          ranges: string;
          type?: "rows" | "columns";
        };
        path: {
          tableId: string;
        };
      };
      responses: {
        /** @description Copy content */
        200: {
          content: {
            "application/json": {
              content: string;
              header: ({
                  /** @description The id of the field. */
                  id: string;
                  /**
                   * @description The name of the field. can not be duplicated in the table.
                   * @example Tags
                   */
                  name: string;
                  /**
                   * @description The field types supported by teable.
                   * @example singleSelect
                   * @enum {string}
                   */
                  type: "singleLineText" | "longText" | "user" | "attachment" | "checkbox" | "multipleSelect" | "singleSelect" | "date" | "number" | "rating" | "formula" | "rollup" | "link" | "createdTime" | "lastModifiedTime" | "createdBy" | "lastModifiedBy" | "autoNumber" | "button" | "department" | "createdByDepartment" | "lastModifiedByDepartment";
                  /**
                   * @description The description of the field.
                   * @example this is a summary
                   */
                  description?: string;
                  /** @description The configuration options of the field. The structure of the field's options depend on the field's type. */
                  options: ({
                    /** @enum {string} */
                    expression: "countall({values})" | "counta({values})" | "count({values})" | "sum({values})" | "max({values})" | "min({values})" | "and({values})" | "or({values})" | "xor({values})" | "array_join({values})" | "array_unique({values})" | "array_compact({values})" | "concatenate({values})";
                    /** @description The time zone that should be used to format dates */
                    timeZone?: string;
                    /** @description Different cell value types are determined based on the results of expression parsing, where numbers, dates, and formatting options are provided */
                    formatting?: ({
                      /** @description the display formatting of the date. you can use the following presets: M/D/YYYY, D/M/YYYY, YYYY/MM/DD, YYYY-MM-DD, YYYY-MM, MM-DD, YYYY, MM, DD */
                      date: string;
                      /**
                       * @description the display formatting of the time. you can use the following presets: HH:mm, hh:mm A, None
                       * @enum {string}
                       */
                      time: "HH:mm" | "hh:mm A" | "None";
                      /** @description The time zone that should be used to format dates */
                      timeZone: string;
                    }) | {
                      precision: number;
                      /** @enum {string} */
                      type: "decimal";
                    } | {
                      precision: number;
                      /** @enum {string} */
                      type: "percent";
                    } | {
                      precision: number;
                      /** @enum {string} */
                      type: "currency";
                      symbol: string;
                    };
                    /** @description According to the results of expression parsing to determine different visual effects, where strings, numbers will provide customized "show as" */
                    showAs?: ({
                      /**
                       * @description can display as url, email or phone in string field with a button to perform the corresponding action, start a phone call, send an email, or open a link in a new tab
                       * @enum {string}
                       */
                      type: "url" | "email" | "phone";
                    }) | ({
                      /**
                       * @description can display as bar or ring in number field with single cellValue value
                       * @enum {string}
                       */
                      type: "bar" | "ring";
                      /** @enum {string} */
                      color: "blueLight2" | "blueLight1" | "blueBright" | "blue" | "blueDark1" | "cyanLight2" | "cyanLight1" | "cyanBright" | "cyan" | "cyanDark1" | "grayLight2" | "grayLight1" | "grayBright" | "gray" | "grayDark1" | "greenLight2" | "greenLight1" | "greenBright" | "green" | "greenDark1" | "orangeLight2" | "orangeLight1" | "orangeBright" | "orange" | "orangeDark1" | "pinkLight2" | "pinkLight1" | "pinkBright" | "pink" | "pinkDark1" | "purpleLight2" | "purpleLight1" | "purpleBright" | "purple" | "purpleDark1" | "redLight2" | "redLight1" | "redBright" | "red" | "redDark1" | "tealLight2" | "tealLight1" | "tealBright" | "teal" | "tealDark1" | "yellowLight2" | "yellowLight1" | "yellowBright" | "yellow" | "yellowDark1";
                      /** @description whether to displays the specific value on the graph */
                      showValue: boolean;
                      /** @description the value that represents a 100% maximum value, it does not represent a hard limit on the value */
                      maxValue: number;
                    }) | ({
                      /**
                       * @description can display as bar or line in number field with multiple cellValue value
                       * @enum {string}
                       */
                      type: "bar" | "line";
                      /** @enum {string} */
                      color: "blueLight2" | "blueLight1" | "blueBright" | "blue" | "blueDark1" | "cyanLight2" | "cyanLight1" | "cyanBright" | "cyan" | "cyanDark1" | "grayLight2" | "grayLight1" | "grayBright" | "gray" | "grayDark1" | "greenLight2" | "greenLight1" | "greenBright" | "green" | "greenDark1" | "orangeLight2" | "orangeLight1" | "orangeBright" | "orange" | "orangeDark1" | "pinkLight2" | "pinkLight1" | "pinkBright" | "pink" | "pinkDark1" | "purpleLight2" | "purpleLight1" | "purpleBright" | "purple" | "purpleDark1" | "redLight2" | "redLight1" | "redBright" | "red" | "redDark1" | "tealLight2" | "tealLight1" | "tealBright" | "teal" | "tealDark1" | "yellowLight2" | "yellowLight1" | "yellowBright" | "yellow" | "yellowDark1";
                    });
                  }) | ({
                    /** @description The formula including fields referenced by their IDs. For example, LEFT(4, {Birthday}) input will be returned as LEFT(4, {fldXXX}) via API. The formula syntax in Teable is basically the same as Airtable */
                    expression: string;
                    /** @description The time zone that should be used to format dates */
                    timeZone?: string;
                    /** @description Different cell value types are determined based on the results of expression parsing, where numbers, dates, and formatting options are provided */
                    formatting?: ({
                      /** @description the display formatting of the date. you can use the following presets: M/D/YYYY, D/M/YYYY, YYYY/MM/DD, YYYY-MM-DD, YYYY-MM, MM-DD, YYYY, MM, DD */
                      date: string;
                      /**
                       * @description the display formatting of the time. you can use the following presets: HH:mm, hh:mm A, None
                       * @enum {string}
                       */
                      time: "HH:mm" | "hh:mm A" | "None";
                      /** @description The time zone that should be used to format dates */
                      timeZone: string;
                    }) | {
                      precision: number;
                      /** @enum {string} */
                      type: "decimal";
                    } | {
                      precision: number;
                      /** @enum {string} */
                      type: "percent";
                    } | {
                      precision: number;
                      /** @enum {string} */
                      type: "currency";
                      symbol: string;
                    };
                    /** @description According to the results of expression parsing to determine different visual effects, where strings, numbers will provide customized "show as" */
                    showAs?: ({
                      /**
                       * @description can display as url, email or phone in string field with a button to perform the corresponding action, start a phone call, send an email, or open a link in a new tab
                       * @enum {string}
                       */
                      type: "url" | "email" | "phone";
                    }) | ({
                      /**
                       * @description can display as bar or ring in number field with single cellValue value
                       * @enum {string}
                       */
                      type: "bar" | "ring";
                      /** @enum {string} */
                      color: "blueLight2" | "blueLight1" | "blueBright" | "blue" | "blueDark1" | "cyanLight2" | "cyanLight1" | "cyanBright" | "cyan" | "cyanDark1" | "grayLight2" | "grayLight1" | "grayBright" | "gray" | "grayDark1" | "greenLight2" | "greenLight1" | "greenBright" | "green" | "greenDark1" | "orangeLight2" | "orangeLight1" | "orangeBright" | "orange" | "orangeDark1" | "pinkLight2" | "pinkLight1" | "pinkBright" | "pink" | "pinkDark1" | "purpleLight2" | "purpleLight1" | "purpleBright" | "purple" | "purpleDark1" | "redLight2" | "redLight1" | "redBright" | "red" | "redDark1" | "tealLight2" | "tealLight1" | "tealBright" | "teal" | "tealDark1" | "yellowLight2" | "yellowLight1" | "yellowBright" | "yellow" | "yellowDark1";
                      /** @description whether to displays the specific value on the graph */
                      showValue: boolean;
                      /** @description the value that represents a 100% maximum value, it does not represent a hard limit on the value */
                      maxValue: number;
                    }) | ({
                      /**
                       * @description can display as bar or line in number field with multiple cellValue value
                       * @enum {string}
                       */
                      type: "bar" | "line";
                      /** @enum {string} */
                      color: "blueLight2" | "blueLight1" | "blueBright" | "blue" | "blueDark1" | "cyanLight2" | "cyanLight1" | "cyanBright" | "cyan" | "cyanDark1" | "grayLight2" | "grayLight1" | "grayBright" | "gray" | "grayDark1" | "greenLight2" | "greenLight1" | "greenBright" | "green" | "greenDark1" | "orangeLight2" | "orangeLight1" | "orangeBright" | "orange" | "orangeDark1" | "pinkLight2" | "pinkLight1" | "pinkBright" | "pink" | "pinkDark1" | "purpleLight2" | "purpleLight1" | "purpleBright" | "purple" | "purpleDark1" | "redLight2" | "redLight1" | "redBright" | "red" | "redDark1" | "tealLight2" | "tealLight1" | "tealBright" | "teal" | "tealDark1" | "yellowLight2" | "yellowLight1" | "yellowBright" | "yellow" | "yellowDark1";
                    });
                  }) | ({
                    /** @description the base id of the table that this field is linked to, only required for cross base link */
                    baseId?: string;
                    /**
                     * @description describe the relationship from this table to the foreign table
                     * @enum {string}
                     */
                    relationship: "oneOne" | "manyMany" | "oneMany" | "manyOne";
                    /** @description the table this field is linked to */
                    foreignTableId: string;
                    /** @description the field in the foreign table that will be displayed as the current field */
                    lookupFieldId: string;
                    /** @description whether the field is a one-way link, when true, it will not generate a symmetric field, it is generally has better performance */
                    isOneWay?: boolean;
                    /** @description the table name for storing keys, in many-to-many relationships, keys are stored in a separate intermediate table; in other relationships, keys are stored on one side as needed */
                    fkHostTableName: string;
                    /** @description the name of the field that stores the current table primary key */
                    selfKeyName: string;
                    /** @description The name of the field that stores the foreign table primary key */
                    foreignKeyName: string;
                    /** @description the symmetric field in the foreign table, empty if the field is a one-way link */
                    symmetricFieldId?: string;
                    /** @description the view id that limits the number of records in the link field */
                    filterByViewId?: string | null;
                    /** @description the fields that will be displayed in the link field */
                    visibleFieldIds?: string[] | null;
                    /** @description A filter object for complex query conditions based on fields, operators, and values. Use our visual query builder at https://app.teable.ai/developer/tool/query-builder to build filters. */
                    filter?: Record<string, never>;
                  }) | ({
                    /** @description caveat: the formatting is just a formatter, it dose not effect the storing value of the record */
                    formatting: {
                      /** @description the display formatting of the date. you can use the following presets: M/D/YYYY, D/M/YYYY, YYYY/MM/DD, YYYY-MM-DD, YYYY-MM, MM-DD, YYYY, MM, DD */
                      date: string;
                      /**
                       * @description the display formatting of the time. you can use the following presets: HH:mm, hh:mm A, None
                       * @enum {string}
                       */
                      time: "HH:mm" | "hh:mm A" | "None";
                      /** @description The time zone that should be used to format dates */
                      timeZone: string;
                    };
                    /**
                     * @description Whether the new row is automatically filled with the current time, caveat: the defaultValue is just a flag, it dose not effect the storing value of the record
                     * @enum {string}
                     */
                    defaultValue?: "now";
                  }) | {
                    defaultValue?: boolean;
                  } | Record<string, never> | ({
                    /** @description Only be used in single line text field or formula / rollup field with cellValueType equals String and isMultipleCellValue is not true */
                    showAs?: {
                      /**
                       * @description can display as url, email or phone in string field with a button to perform the corresponding action, start a phone call, send an email, or open a link in a new tab
                       * @enum {string}
                       */
                      type: "url" | "email" | "phone";
                    };
                    defaultValue?: string;
                  }) | ({
                    /** @enum {string} */
                    icon: "star" | "moon" | "sun" | "zap" | "flame" | "heart" | "apple" | "thumb-up";
                    /** @enum {string} */
                    color: "yellowBright" | "redBright" | "tealBright";
                    max: number;
                  }) | ({
                    /** @description Allow adding multiple users */
                    isMultiple?: boolean;
                    /** @description Notify users when their name is added to a cell */
                    shouldNotify?: boolean;
                    defaultValue?: string | "me" | ((string | "me")[]);
                  }) | ({
                    /** @description Button label */
                    label: string;
                    /**
                     * @description Button color
                     * @enum {string}
                     */
                    color: "blueLight2" | "blueLight1" | "blueBright" | "blue" | "blueDark1" | "cyanLight2" | "cyanLight1" | "cyanBright" | "cyan" | "cyanDark1" | "grayLight2" | "grayLight1" | "grayBright" | "gray" | "grayDark1" | "greenLight2" | "greenLight1" | "greenBright" | "green" | "greenDark1" | "orangeLight2" | "orangeLight1" | "orangeBright" | "orange" | "orangeDark1" | "pinkLight2" | "pinkLight1" | "pinkBright" | "pink" | "pinkDark1" | "purpleLight2" | "purpleLight1" | "purpleBright" | "purple" | "purpleDark1" | "redLight2" | "redLight1" | "redBright" | "red" | "redDark1" | "tealLight2" | "tealLight1" | "tealBright" | "teal" | "tealDark1" | "yellowLight2" | "yellowLight1" | "yellowBright" | "yellow" | "yellowDark1";
                    /** @description Max count of button clicks */
                    maxCount?: number;
                    /** @description Reset count */
                    resetCount?: boolean;
                    /** @description Workflow */
                    workflow?: {
                      /** @description Workflow ID */
                      id?: string;
                      /** @description Workflow Name */
                      name?: string;
                      /** @description Workflow is active */
                      isActive?: boolean;
                    } | null;
                  }) | ({
                    choices: ({
                        id: string;
                        name: string;
                        /** @enum {string} */
                        color: "blueLight2" | "blueLight1" | "blueBright" | "blue" | "blueDark1" | "cyanLight2" | "cyanLight1" | "cyanBright" | "cyan" | "cyanDark1" | "grayLight2" | "grayLight1" | "grayBright" | "gray" | "grayDark1" | "greenLight2" | "greenLight1" | "greenBright" | "green" | "greenDark1" | "orangeLight2" | "orangeLight1" | "orangeBright" | "orange" | "orangeDark1" | "pinkLight2" | "pinkLight1" | "pinkBright" | "pink" | "pinkDark1" | "purpleLight2" | "purpleLight1" | "purpleBright" | "purple" | "purpleDark1" | "redLight2" | "redLight1" | "redBright" | "red" | "redDark1" | "tealLight2" | "tealLight1" | "tealBright" | "teal" | "tealDark1" | "yellowLight2" | "yellowLight1" | "yellowBright" | "yellow" | "yellowDark1";
                      })[];
                    defaultValue?: string | string[];
                    preventAutoNewOptions?: boolean;
                  }) | ({
                    /** @description Only be used in number field (number field or formula / rollup field with cellValueType equals Number */
                    formatting: {
                      precision: number;
                      /** @enum {string} */
                      type: "decimal";
                    } | {
                      precision: number;
                      /** @enum {string} */
                      type: "percent";
                    } | {
                      precision: number;
                      /** @enum {string} */
                      type: "currency";
                      symbol: string;
                    };
                    /** @description Only be used in number field (number field or formula / rollup field with cellValueType equals Number */
                    showAs?: ({
                      /**
                       * @description can display as bar or ring in number field with single cellValue value
                       * @enum {string}
                       */
                      type: "bar" | "ring";
                      /** @enum {string} */
                      color: "blueLight2" | "blueLight1" | "blueBright" | "blue" | "blueDark1" | "cyanLight2" | "cyanLight1" | "cyanBright" | "cyan" | "cyanDark1" | "grayLight2" | "grayLight1" | "grayBright" | "gray" | "grayDark1" | "greenLight2" | "greenLight1" | "greenBright" | "green" | "greenDark1" | "orangeLight2" | "orangeLight1" | "orangeBright" | "orange" | "orangeDark1" | "pinkLight2" | "pinkLight1" | "pinkBright" | "pink" | "pinkDark1" | "purpleLight2" | "purpleLight1" | "purpleBright" | "purple" | "purpleDark1" | "redLight2" | "redLight1" | "redBright" | "red" | "redDark1" | "tealLight2" | "tealLight1" | "tealBright" | "teal" | "tealDark1" | "yellowLight2" | "yellowLight1" | "yellowBright" | "yellow" | "yellowDark1";
                      /** @description whether to displays the specific value on the graph */
                      showValue: boolean;
                      /** @description the value that represents a 100% maximum value, it does not represent a hard limit on the value */
                      maxValue: number;
                    }) | ({
                      /**
                       * @description can display as bar or line in number field with multiple cellValue value
                       * @enum {string}
                       */
                      type: "bar" | "line";
                      /** @enum {string} */
                      color: "blueLight2" | "blueLight1" | "blueBright" | "blue" | "blueDark1" | "cyanLight2" | "cyanLight1" | "cyanBright" | "cyan" | "cyanDark1" | "grayLight2" | "grayLight1" | "grayBright" | "gray" | "grayDark1" | "greenLight2" | "greenLight1" | "greenBright" | "green" | "greenDark1" | "orangeLight2" | "orangeLight1" | "orangeBright" | "orange" | "orangeDark1" | "pinkLight2" | "pinkLight1" | "pinkBright" | "pink" | "pinkDark1" | "purpleLight2" | "purpleLight1" | "purpleBright" | "purple" | "purpleDark1" | "redLight2" | "redLight1" | "redBright" | "red" | "redDark1" | "tealLight2" | "tealLight1" | "tealBright" | "teal" | "tealDark1" | "yellowLight2" | "yellowLight1" | "yellowBright" | "yellow" | "yellowDark1";
                    });
                    defaultValue?: number;
                  }) | {
                    /** @enum {string} */
                    expression: "AUTO_NUMBER()";
                  } | ({
                    /** @enum {string} */
                    expression: "CREATED_TIME()";
                    /** @description caveat: the formatting is just a formatter, it dose not effect the storing value of the record */
                    formatting: {
                      /** @description the display formatting of the date. you can use the following presets: M/D/YYYY, D/M/YYYY, YYYY/MM/DD, YYYY-MM-DD, YYYY-MM, MM-DD, YYYY, MM, DD */
                      date: string;
                      /**
                       * @description the display formatting of the time. you can use the following presets: HH:mm, hh:mm A, None
                       * @enum {string}
                       */
                      time: "HH:mm" | "hh:mm A" | "None";
                      /** @description The time zone that should be used to format dates */
                      timeZone: string;
                    };
                  }) | ({
                    /** @enum {string} */
                    expression: "LAST_MODIFIED_TIME()";
                    /** @description caveat: the formatting is just a formatter, it dose not effect the storing value of the record */
                    formatting: {
                      /** @description the display formatting of the date. you can use the following presets: M/D/YYYY, D/M/YYYY, YYYY/MM/DD, YYYY-MM-DD, YYYY-MM, MM-DD, YYYY, MM, DD */
                      date: string;
                      /**
                       * @description the display formatting of the time. you can use the following presets: HH:mm, hh:mm A, None
                       * @enum {string}
                       */
                      time: "HH:mm" | "hh:mm A" | "None";
                      /** @description The time zone that should be used to format dates */
                      timeZone: string;
                    };
                  });
                  /** @description The AI configuration of the field. */
                  aiConfig?: unknown;
                  /** @description Whether this field is lookup field. witch means cellValue and [fieldType] is looked up from the linked table. */
                  isLookup?: boolean;
                  /** @description field lookup options. */
                  lookupOptions?: {
                    /** @description the table this field is linked to */
                    foreignTableId: string;
                    /** @description the field in the foreign table that will be displayed as the current field */
                    lookupFieldId: string;
                    /**
                     * @description describe the relationship from this table to the foreign table
                     * @enum {string}
                     */
                    relationship: "oneOne" | "manyMany" | "oneMany" | "manyOne";
                    /** @description the table name for storing keys, in many-to-many relationships, keys are stored in a separate intermediate table; in other relationships, keys are stored on one side as needed */
                    fkHostTableName: string;
                    /** @description the name of the field that stores the current table primary key */
                    selfKeyName: string;
                    /** @description The name of the field that stores the foreign table primary key */
                    foreignKeyName: string;
                    /** @description A filter object for complex query conditions based on fields, operators, and values. Use our visual query builder at https://app.teable.ai/developer/tool/query-builder to build filters. */
                    filter?: Record<string, never>;
                    /** @description The id of Linked record field to use for lookup */
                    linkFieldId: string;
                  };
                  /** @description Whether this field is not null. */
                  notNull?: boolean;
                  /** @description Whether this field is not unique. */
                  unique?: boolean;
                  /** @description Whether this field is primary field. */
                  isPrimary?: boolean;
                  /** @description Whether this field is computed field, you can not modify cellValue in computed field. */
                  isComputed?: boolean;
                  /** @description Whether this field's calculation is pending. */
                  isPending?: boolean;
                  /** @description Whether This field has a configuration error. Check the fields referenced by this field's formula or configuration. */
                  hasError?: boolean;
                  /**
                   * @description The cell value type of the field.
                   * @enum {string}
                   */
                  cellValueType: "string" | "number" | "boolean" | "dateTime";
                  /** @description Whether this field has multiple cell value. */
                  isMultipleCellValue?: boolean;
                  /**
                   * @description The field type of database that cellValue really store.
                   * @enum {string}
                   */
                  dbFieldType: "TEXT" | "INTEGER" | "DATETIME" | "REAL" | "BLOB" | "JSON" | "BOOLEAN";
                  /** @description Field(column) name in backend database. Limitation: 1-63 characters, can only contain letters, numbers and underscore, case sensitive, cannot be duplicated with existing db field name in the table. */
                  dbFieldName: string;
                  /** @description Field record read permission. When set to false, reading records is denied. When true or not set, reading records is allowed. */
                  recordRead?: boolean;
                  /** @description Field record create permission. When set to false, creating records is denied. When true or not set, creating records is allowed. */
                  recordCreate?: boolean;
                })[];
            };
          };
        };
      };
    };
  };
  "/table/{tableId}/selection/paste": {
    /**
     * Paste content into selected range
     * @description Apply paste operation to insert content into the selected table range
     */
    patch: {
      parameters: {
        path: {
          tableId: string;
        };
      };
      requestBody?: {
        content: {
          "application/json": {
            /**
             * @description Set the view you want to fetch, default is first view. result will filter and sort by view options.
             * @example viwXXXXXXX
             */
            viewId?: string;
            /** @description When a viewId is specified, configure this to true will ignore the view's filter, sort, etc */
            ignoreViewQuery?: string | boolean;
            /**
             * @deprecated
             * @example {field} = 'Completed' AND {field} > 5
             */
            filterByTql?: string;
            /** @description A filter object for complex query conditions based on fields, operators, and values. Use our visual query builder at https://app.teable.ai/developer/tool/query-builder to build filters. */
            filter?: Record<string, never>;
            /**
             * @description Search for records that match the specified field and value
             * @default [
             *   "searchValue",
             *   "fieldIdOrName",
             *   false
             * ]
             */
            search?: string[] | ((string | (string | boolean))[]);
            /**
             * @description Filter out the records that can be selected by a given link cell from the relational table. For example, if the specified field is one to many or one to one relationship, recordId for which the field has already been selected will not appear.
             * @example [
             *   "fldXXXXXXX",
             *   "recXXXXXXX"
             * ]
             */
            filterLinkCellCandidate?: string[] | string;
            /**
             * @description Filter out selected records based on this link cell from the relational table. Note that viewId, filter, and orderBy will not take effect in this case because selected records has it own order. Ignoring recordId gets all the selected records for the field
             * @example [
             *   "fldXXXXXXX",
             *   "recXXXXXXX"
             * ]
             */
            filterLinkCellSelected?: string[] | string;
            /** @description Filter selected records by record ids */
            selectedRecordIds?: string[];
            /** @description An array of sort objects that specifies how the records should be ordered. */
            orderBy?: unknown[];
            groupBy?: (({
                /** @description The id of the field. */
                fieldId: string;
                /** @enum {string} */
                order: "asc" | "desc";
              })[]) | null;
            collapsedGroupIds?: string[];
            /**
             * @description When provided, other query parameters will be merged with the saved ones.
             * @example qry_xxxxxxxx
             */
            queryId?: string;
            /** @description If you want to get only some fields, pass in this parameter, otherwise all visible fields will be obtained */
            projection?: string[];
            /**
             * @description The parameter "ranges" is used to represent the coordinates of a selected range in a table.
             * @example [
             *   [
             *     0,
             *     0
             *   ],
             *   [
             *     1,
             *     1
             *   ]
             * ]
             */
            ranges: number[][];
            /**
             * @description Types of non-contiguous selections
             * @example columns
             * @enum {string}
             */
            type?: "rows" | "columns";
            /**
             * @description Content to paste
             * @example John	Doe	john.doe@example.com
             */
            content: string | unknown[][];
            /**
             * @description Table header for paste operation
             * @example []
             */
            header?: ({
                /** @description The id of the field. */
                id: string;
                /**
                 * @description The name of the field. can not be duplicated in the table.
                 * @example Tags
                 */
                name: string;
                /**
                 * @description The field types supported by teable.
                 * @example singleSelect
                 * @enum {string}
                 */
                type: "singleLineText" | "longText" | "user" | "attachment" | "checkbox" | "multipleSelect" | "singleSelect" | "date" | "number" | "rating" | "formula" | "rollup" | "link" | "createdTime" | "lastModifiedTime" | "createdBy" | "lastModifiedBy" | "autoNumber" | "button" | "department" | "createdByDepartment" | "lastModifiedByDepartment";
                /**
                 * @description The description of the field.
                 * @example this is a summary
                 */
                description?: string;
                /** @description The configuration options of the field. The structure of the field's options depend on the field's type. */
                options: ({
                  /** @enum {string} */
                  expression: "countall({values})" | "counta({values})" | "count({values})" | "sum({values})" | "max({values})" | "min({values})" | "and({values})" | "or({values})" | "xor({values})" | "array_join({values})" | "array_unique({values})" | "array_compact({values})" | "concatenate({values})";
                  /** @description The time zone that should be used to format dates */
                  timeZone?: string;
                  /** @description Different cell value types are determined based on the results of expression parsing, where numbers, dates, and formatting options are provided */
                  formatting?: ({
                    /** @description the display formatting of the date. you can use the following presets: M/D/YYYY, D/M/YYYY, YYYY/MM/DD, YYYY-MM-DD, YYYY-MM, MM-DD, YYYY, MM, DD */
                    date: string;
                    /**
                     * @description the display formatting of the time. you can use the following presets: HH:mm, hh:mm A, None
                     * @enum {string}
                     */
                    time: "HH:mm" | "hh:mm A" | "None";
                    /** @description The time zone that should be used to format dates */
                    timeZone: string;
                  }) | {
                    precision: number;
                    /** @enum {string} */
                    type: "decimal";
                  } | {
                    precision: number;
                    /** @enum {string} */
                    type: "percent";
                  } | {
                    precision: number;
                    /** @enum {string} */
                    type: "currency";
                    symbol: string;
                  };
                  /** @description According to the results of expression parsing to determine different visual effects, where strings, numbers will provide customized "show as" */
                  showAs?: ({
                    /**
                     * @description can display as url, email or phone in string field with a button to perform the corresponding action, start a phone call, send an email, or open a link in a new tab
                     * @enum {string}
                     */
                    type: "url" | "email" | "phone";
                  }) | ({
                    /**
                     * @description can display as bar or ring in number field with single cellValue value
                     * @enum {string}
                     */
                    type: "bar" | "ring";
                    /** @enum {string} */
                    color: "blueLight2" | "blueLight1" | "blueBright" | "blue" | "blueDark1" | "cyanLight2" | "cyanLight1" | "cyanBright" | "cyan" | "cyanDark1" | "grayLight2" | "grayLight1" | "grayBright" | "gray" | "grayDark1" | "greenLight2" | "greenLight1" | "greenBright" | "green" | "greenDark1" | "orangeLight2" | "orangeLight1" | "orangeBright" | "orange" | "orangeDark1" | "pinkLight2" | "pinkLight1" | "pinkBright" | "pink" | "pinkDark1" | "purpleLight2" | "purpleLight1" | "purpleBright" | "purple" | "purpleDark1" | "redLight2" | "redLight1" | "redBright" | "red" | "redDark1" | "tealLight2" | "tealLight1" | "tealBright" | "teal" | "tealDark1" | "yellowLight2" | "yellowLight1" | "yellowBright" | "yellow" | "yellowDark1";
                    /** @description whether to displays the specific value on the graph */
                    showValue: boolean;
                    /** @description the value that represents a 100% maximum value, it does not represent a hard limit on the value */
                    maxValue: number;
                  }) | ({
                    /**
                     * @description can display as bar or line in number field with multiple cellValue value
                     * @enum {string}
                     */
                    type: "bar" | "line";
                    /** @enum {string} */
                    color: "blueLight2" | "blueLight1" | "blueBright" | "blue" | "blueDark1" | "cyanLight2" | "cyanLight1" | "cyanBright" | "cyan" | "cyanDark1" | "grayLight2" | "grayLight1" | "grayBright" | "gray" | "grayDark1" | "greenLight2" | "greenLight1" | "greenBright" | "green" | "greenDark1" | "orangeLight2" | "orangeLight1" | "orangeBright" | "orange" | "orangeDark1" | "pinkLight2" | "pinkLight1" | "pinkBright" | "pink" | "pinkDark1" | "purpleLight2" | "purpleLight1" | "purpleBright" | "purple" | "purpleDark1" | "redLight2" | "redLight1" | "redBright" | "red" | "redDark1" | "tealLight2" | "tealLight1" | "tealBright" | "teal" | "tealDark1" | "yellowLight2" | "yellowLight1" | "yellowBright" | "yellow" | "yellowDark1";
                  });
                }) | ({
                  /** @description The formula including fields referenced by their IDs. For example, LEFT(4, {Birthday}) input will be returned as LEFT(4, {fldXXX}) via API. The formula syntax in Teable is basically the same as Airtable */
                  expression: string;
                  /** @description The time zone that should be used to format dates */
                  timeZone?: string;
                  /** @description Different cell value types are determined based on the results of expression parsing, where numbers, dates, and formatting options are provided */
                  formatting?: ({
                    /** @description the display formatting of the date. you can use the following presets: M/D/YYYY, D/M/YYYY, YYYY/MM/DD, YYYY-MM-DD, YYYY-MM, MM-DD, YYYY, MM, DD */
                    date: string;
                    /**
                     * @description the display formatting of the time. you can use the following presets: HH:mm, hh:mm A, None
                     * @enum {string}
                     */
                    time: "HH:mm" | "hh:mm A" | "None";
                    /** @description The time zone that should be used to format dates */
                    timeZone: string;
                  }) | {
                    precision: number;
                    /** @enum {string} */
                    type: "decimal";
                  } | {
                    precision: number;
                    /** @enum {string} */
                    type: "percent";
                  } | {
                    precision: number;
                    /** @enum {string} */
                    type: "currency";
                    symbol: string;
                  };
                  /** @description According to the results of expression parsing to determine different visual effects, where strings, numbers will provide customized "show as" */
                  showAs?: ({
                    /**
                     * @description can display as url, email or phone in string field with a button to perform the corresponding action, start a phone call, send an email, or open a link in a new tab
                     * @enum {string}
                     */
                    type: "url" | "email" | "phone";
                  }) | ({
                    /**
                     * @description can display as bar or ring in number field with single cellValue value
                     * @enum {string}
                     */
                    type: "bar" | "ring";
                    /** @enum {string} */
                    color: "blueLight2" | "blueLight1" | "blueBright" | "blue" | "blueDark1" | "cyanLight2" | "cyanLight1" | "cyanBright" | "cyan" | "cyanDark1" | "grayLight2" | "grayLight1" | "grayBright" | "gray" | "grayDark1" | "greenLight2" | "greenLight1" | "greenBright" | "green" | "greenDark1" | "orangeLight2" | "orangeLight1" | "orangeBright" | "orange" | "orangeDark1" | "pinkLight2" | "pinkLight1" | "pinkBright" | "pink" | "pinkDark1" | "purpleLight2" | "purpleLight1" | "purpleBright" | "purple" | "purpleDark1" | "redLight2" | "redLight1" | "redBright" | "red" | "redDark1" | "tealLight2" | "tealLight1" | "tealBright" | "teal" | "tealDark1" | "yellowLight2" | "yellowLight1" | "yellowBright" | "yellow" | "yellowDark1";
                    /** @description whether to displays the specific value on the graph */
                    showValue: boolean;
                    /** @description the value that represents a 100% maximum value, it does not represent a hard limit on the value */
                    maxValue: number;
                  }) | ({
                    /**
                     * @description can display as bar or line in number field with multiple cellValue value
                     * @enum {string}
                     */
                    type: "bar" | "line";
                    /** @enum {string} */
                    color: "blueLight2" | "blueLight1" | "blueBright" | "blue" | "blueDark1" | "cyanLight2" | "cyanLight1" | "cyanBright" | "cyan" | "cyanDark1" | "grayLight2" | "grayLight1" | "grayBright" | "gray" | "grayDark1" | "greenLight2" | "greenLight1" | "greenBright" | "green" | "greenDark1" | "orangeLight2" | "orangeLight1" | "orangeBright" | "orange" | "orangeDark1" | "pinkLight2" | "pinkLight1" | "pinkBright" | "pink" | "pinkDark1" | "purpleLight2" | "purpleLight1" | "purpleBright" | "purple" | "purpleDark1" | "redLight2" | "redLight1" | "redBright" | "red" | "redDark1" | "tealLight2" | "tealLight1" | "tealBright" | "teal" | "tealDark1" | "yellowLight2" | "yellowLight1" | "yellowBright" | "yellow" | "yellowDark1";
                  });
                }) | ({
                  /** @description the base id of the table that this field is linked to, only required for cross base link */
                  baseId?: string;
                  /**
                   * @description describe the relationship from this table to the foreign table
                   * @enum {string}
                   */
                  relationship: "oneOne" | "manyMany" | "oneMany" | "manyOne";
                  /** @description the table this field is linked to */
                  foreignTableId: string;
                  /** @description the field in the foreign table that will be displayed as the current field */
                  lookupFieldId: string;
                  /** @description whether the field is a one-way link, when true, it will not generate a symmetric field, it is generally has better performance */
                  isOneWay?: boolean;
                  /** @description the table name for storing keys, in many-to-many relationships, keys are stored in a separate intermediate table; in other relationships, keys are stored on one side as needed */
                  fkHostTableName: string;
                  /** @description the name of the field that stores the current table primary key */
                  selfKeyName: string;
                  /** @description The name of the field that stores the foreign table primary key */
                  foreignKeyName: string;
                  /** @description the symmetric field in the foreign table, empty if the field is a one-way link */
                  symmetricFieldId?: string;
                  /** @description the view id that limits the number of records in the link field */
                  filterByViewId?: string | null;
                  /** @description the fields that will be displayed in the link field */
                  visibleFieldIds?: string[] | null;
                  /** @description A filter object for complex query conditions based on fields, operators, and values. Use our visual query builder at https://app.teable.ai/developer/tool/query-builder to build filters. */
                  filter?: Record<string, never>;
                }) | ({
                  /** @description caveat: the formatting is just a formatter, it dose not effect the storing value of the record */
                  formatting: {
                    /** @description the display formatting of the date. you can use the following presets: M/D/YYYY, D/M/YYYY, YYYY/MM/DD, YYYY-MM-DD, YYYY-MM, MM-DD, YYYY, MM, DD */
                    date: string;
                    /**
                     * @description the display formatting of the time. you can use the following presets: HH:mm, hh:mm A, None
                     * @enum {string}
                     */
                    time: "HH:mm" | "hh:mm A" | "None";
                    /** @description The time zone that should be used to format dates */
                    timeZone: string;
                  };
                  /**
                   * @description Whether the new row is automatically filled with the current time, caveat: the defaultValue is just a flag, it dose not effect the storing value of the record
                   * @enum {string}
                   */
                  defaultValue?: "now";
                }) | {
                  defaultValue?: boolean;
                } | Record<string, never> | ({
                  /** @description Only be used in single line text field or formula / rollup field with cellValueType equals String and isMultipleCellValue is not true */
                  showAs?: {
                    /**
                     * @description can display as url, email or phone in string field with a button to perform the corresponding action, start a phone call, send an email, or open a link in a new tab
                     * @enum {string}
                     */
                    type: "url" | "email" | "phone";
                  };
                  defaultValue?: string;
                }) | ({
                  /** @enum {string} */
                  icon: "star" | "moon" | "sun" | "zap" | "flame" | "heart" | "apple" | "thumb-up";
                  /** @enum {string} */
                  color: "yellowBright" | "redBright" | "tealBright";
                  max: number;
                }) | ({
                  /** @description Allow adding multiple users */
                  isMultiple?: boolean;
                  /** @description Notify users when their name is added to a cell */
                  shouldNotify?: boolean;
                  defaultValue?: string | "me" | ((string | "me")[]);
                }) | ({
                  /** @description Button label */
                  label: string;
                  /**
                   * @description Button color
                   * @enum {string}
                   */
                  color: "blueLight2" | "blueLight1" | "blueBright" | "blue" | "blueDark1" | "cyanLight2" | "cyanLight1" | "cyanBright" | "cyan" | "cyanDark1" | "grayLight2" | "grayLight1" | "grayBright" | "gray" | "grayDark1" | "greenLight2" | "greenLight1" | "greenBright" | "green" | "greenDark1" | "orangeLight2" | "orangeLight1" | "orangeBright" | "orange" | "orangeDark1" | "pinkLight2" | "pinkLight1" | "pinkBright" | "pink" | "pinkDark1" | "purpleLight2" | "purpleLight1" | "purpleBright" | "purple" | "purpleDark1" | "redLight2" | "redLight1" | "redBright" | "red" | "redDark1" | "tealLight2" | "tealLight1" | "tealBright" | "teal" | "tealDark1" | "yellowLight2" | "yellowLight1" | "yellowBright" | "yellow" | "yellowDark1";
                  /** @description Max count of button clicks */
                  maxCount?: number;
                  /** @description Reset count */
                  resetCount?: boolean;
                  /** @description Workflow */
                  workflow?: {
                    /** @description Workflow ID */
                    id?: string;
                    /** @description Workflow Name */
                    name?: string;
                    /** @description Workflow is active */
                    isActive?: boolean;
                  } | null;
                }) | ({
                  choices: ({
                      id: string;
                      name: string;
                      /** @enum {string} */
                      color: "blueLight2" | "blueLight1" | "blueBright" | "blue" | "blueDark1" | "cyanLight2" | "cyanLight1" | "cyanBright" | "cyan" | "cyanDark1" | "grayLight2" | "grayLight1" | "grayBright" | "gray" | "grayDark1" | "greenLight2" | "greenLight1" | "greenBright" | "green" | "greenDark1" | "orangeLight2" | "orangeLight1" | "orangeBright" | "orange" | "orangeDark1" | "pinkLight2" | "pinkLight1" | "pinkBright" | "pink" | "pinkDark1" | "purpleLight2" | "purpleLight1" | "purpleBright" | "purple" | "purpleDark1" | "redLight2" | "redLight1" | "redBright" | "red" | "redDark1" | "tealLight2" | "tealLight1" | "tealBright" | "teal" | "tealDark1" | "yellowLight2" | "yellowLight1" | "yellowBright" | "yellow" | "yellowDark1";
                    })[];
                  defaultValue?: string | string[];
                  preventAutoNewOptions?: boolean;
                }) | ({
                  /** @description Only be used in number field (number field or formula / rollup field with cellValueType equals Number */
                  formatting: {
                    precision: number;
                    /** @enum {string} */
                    type: "decimal";
                  } | {
                    precision: number;
                    /** @enum {string} */
                    type: "percent";
                  } | {
                    precision: number;
                    /** @enum {string} */
                    type: "currency";
                    symbol: string;
                  };
                  /** @description Only be used in number field (number field or formula / rollup field with cellValueType equals Number */
                  showAs?: ({
                    /**
                     * @description can display as bar or ring in number field with single cellValue value
                     * @enum {string}
                     */
                    type: "bar" | "ring";
                    /** @enum {string} */
                    color: "blueLight2" | "blueLight1" | "blueBright" | "blue" | "blueDark1" | "cyanLight2" | "cyanLight1" | "cyanBright" | "cyan" | "cyanDark1" | "grayLight2" | "grayLight1" | "grayBright" | "gray" | "grayDark1" | "greenLight2" | "greenLight1" | "greenBright" | "green" | "greenDark1" | "orangeLight2" | "orangeLight1" | "orangeBright" | "orange" | "orangeDark1" | "pinkLight2" | "pinkLight1" | "pinkBright" | "pink" | "pinkDark1" | "purpleLight2" | "purpleLight1" | "purpleBright" | "purple" | "purpleDark1" | "redLight2" | "redLight1" | "redBright" | "red" | "redDark1" | "tealLight2" | "tealLight1" | "tealBright" | "teal" | "tealDark1" | "yellowLight2" | "yellowLight1" | "yellowBright" | "yellow" | "yellowDark1";
                    /** @description whether to displays the specific value on the graph */
                    showValue: boolean;
                    /** @description the value that represents a 100% maximum value, it does not represent a hard limit on the value */
                    maxValue: number;
                  }) | ({
                    /**
                     * @description can display as bar or line in number field with multiple cellValue value
                     * @enum {string}
                     */
                    type: "bar" | "line";
                    /** @enum {string} */
                    color: "blueLight2" | "blueLight1" | "blueBright" | "blue" | "blueDark1" | "cyanLight2" | "cyanLight1" | "cyanBright" | "cyan" | "cyanDark1" | "grayLight2" | "grayLight1" | "grayBright" | "gray" | "grayDark1" | "greenLight2" | "greenLight1" | "greenBright" | "green" | "greenDark1" | "orangeLight2" | "orangeLight1" | "orangeBright" | "orange" | "orangeDark1" | "pinkLight2" | "pinkLight1" | "pinkBright" | "pink" | "pinkDark1" | "purpleLight2" | "purpleLight1" | "purpleBright" | "purple" | "purpleDark1" | "redLight2" | "redLight1" | "redBright" | "red" | "redDark1" | "tealLight2" | "tealLight1" | "tealBright" | "teal" | "tealDark1" | "yellowLight2" | "yellowLight1" | "yellowBright" | "yellow" | "yellowDark1";
                  });
                  defaultValue?: number;
                }) | {
                  /** @enum {string} */
                  expression: "AUTO_NUMBER()";
                } | ({
                  /** @enum {string} */
                  expression: "CREATED_TIME()";
                  /** @description caveat: the formatting is just a formatter, it dose not effect the storing value of the record */
                  formatting: {
                    /** @description the display formatting of the date. you can use the following presets: M/D/YYYY, D/M/YYYY, YYYY/MM/DD, YYYY-MM-DD, YYYY-MM, MM-DD, YYYY, MM, DD */
                    date: string;
                    /**
                     * @description the display formatting of the time. you can use the following presets: HH:mm, hh:mm A, None
                     * @enum {string}
                     */
                    time: "HH:mm" | "hh:mm A" | "None";
                    /** @description The time zone that should be used to format dates */
                    timeZone: string;
                  };
                }) | ({
                  /** @enum {string} */
                  expression: "LAST_MODIFIED_TIME()";
                  /** @description caveat: the formatting is just a formatter, it dose not effect the storing value of the record */
                  formatting: {
                    /** @description the display formatting of the date. you can use the following presets: M/D/YYYY, D/M/YYYY, YYYY/MM/DD, YYYY-MM-DD, YYYY-MM, MM-DD, YYYY, MM, DD */
                    date: string;
                    /**
                     * @description the display formatting of the time. you can use the following presets: HH:mm, hh:mm A, None
                     * @enum {string}
                     */
                    time: "HH:mm" | "hh:mm A" | "None";
                    /** @description The time zone that should be used to format dates */
                    timeZone: string;
                  };
                });
                /** @description The AI configuration of the field. */
                aiConfig?: unknown;
                /** @description Whether this field is lookup field. witch means cellValue and [fieldType] is looked up from the linked table. */
                isLookup?: boolean;
                /** @description field lookup options. */
                lookupOptions?: {
                  /** @description the table this field is linked to */
                  foreignTableId: string;
                  /** @description the field in the foreign table that will be displayed as the current field */
                  lookupFieldId: string;
                  /**
                   * @description describe the relationship from this table to the foreign table
                   * @enum {string}
                   */
                  relationship: "oneOne" | "manyMany" | "oneMany" | "manyOne";
                  /** @description the table name for storing keys, in many-to-many relationships, keys are stored in a separate intermediate table; in other relationships, keys are stored on one side as needed */
                  fkHostTableName: string;
                  /** @description the name of the field that stores the current table primary key */
                  selfKeyName: string;
                  /** @description The name of the field that stores the foreign table primary key */
                  foreignKeyName: string;
                  /** @description A filter object for complex query conditions based on fields, operators, and values. Use our visual query builder at https://app.teable.ai/developer/tool/query-builder to build filters. */
                  filter?: Record<string, never>;
                  /** @description The id of Linked record field to use for lookup */
                  linkFieldId: string;
                };
                /** @description Whether this field is not null. */
                notNull?: boolean;
                /** @description Whether this field is not unique. */
                unique?: boolean;
                /** @description Whether this field is primary field. */
                isPrimary?: boolean;
                /** @description Whether this field is computed field, you can not modify cellValue in computed field. */
                isComputed?: boolean;
                /** @description Whether this field's calculation is pending. */
                isPending?: boolean;
                /** @description Whether This field has a configuration error. Check the fields referenced by this field's formula or configuration. */
                hasError?: boolean;
                /**
                 * @description The cell value type of the field.
                 * @enum {string}
                 */
                cellValueType: "string" | "number" | "boolean" | "dateTime";
                /** @description Whether this field has multiple cell value. */
                isMultipleCellValue?: boolean;
                /**
                 * @description The field type of database that cellValue really store.
                 * @enum {string}
                 */
                dbFieldType: "TEXT" | "INTEGER" | "DATETIME" | "REAL" | "BLOB" | "JSON" | "BOOLEAN";
                /** @description Field(column) name in backend database. Limitation: 1-63 characters, can only contain letters, numbers and underscore, case sensitive, cannot be duplicated with existing db field name in the table. */
                dbFieldName: string;
                /** @description Field record read permission. When set to false, reading records is denied. When true or not set, reading records is allowed. */
                recordRead?: boolean;
                /** @description Field record create permission. When set to false, creating records is denied. When true or not set, creating records is allowed. */
                recordCreate?: boolean;
              })[];
          };
        };
      };
      responses: {
        /** @description Paste successfully */
        200: {
          content: {
            "application/json": {
              ranges: number[][];
            };
          };
        };
      };
    };
  };
  "/table/{tableId}/selection/delete": {
    /**
     * Delete selected range data
     * @description Delete records or fields within the selected table range
     */
    delete: {
      parameters: {
        query: {
          viewId?: string;
          ignoreViewQuery?: string | boolean;
          filterByTql?: string;
          filter?: string;
          search?: string[] | ((string | (string | boolean))[]);
          filterLinkCellCandidate?: string[] | string;
          filterLinkCellSelected?: string[] | string;
          selectedRecordIds?: string[];
          orderBy?: string;
          groupBy?: string;
          collapsedGroupIds?: string;
          queryId?: string;
          projection?: string[];
          ranges: string;
          type?: "rows" | "columns";
        };
        path: {
          tableId: string;
        };
      };
      responses: {
        /** @description Successful deletion */
        200: {
          content: {
            "application/json": {
              ids: string[];
            };
          };
        };
      };
    };
  };
  "/table/{tableId}/selection/temporaryPaste": {
    /**
     * Preview paste operation results
     * @description Preview the results of a paste operation without applying changes to the table
     */
    patch: {
      parameters: {
        path: {
          tableId: string;
        };
      };
      requestBody?: {
        content: {
          "application/json": {
            /**
             * @description Set the view you want to fetch, default is first view. result will filter and sort by view options.
             * @example viwXXXXXXX
             */
            viewId?: string;
            /**
             * @description The parameter "ranges" is used to represent the coordinates of a selected range in a table.
             * @example [
             *   [
             *     0,
             *     0
             *   ],
             *   [
             *     1,
             *     1
             *   ]
             * ]
             */
            ranges: number[][];
            /** @description If you want to get only some fields, pass in this parameter, otherwise all visible fields will be obtained */
            projection?: string[];
            /** @description When a viewId is specified, configure this to true will ignore the view's filter, sort, etc */
            ignoreViewQuery?: string | boolean;
            /**
             * @description Content to paste
             * @example John	Doe	john.doe@example.com
             */
            content: string | unknown[][];
            /**
             * @description Table header for paste operation
             * @example []
             */
            header?: ({
                /** @description The id of the field. */
                id: string;
                /**
                 * @description The name of the field. can not be duplicated in the table.
                 * @example Tags
                 */
                name: string;
                /**
                 * @description The field types supported by teable.
                 * @example singleSelect
                 * @enum {string}
                 */
                type: "singleLineText" | "longText" | "user" | "attachment" | "checkbox" | "multipleSelect" | "singleSelect" | "date" | "number" | "rating" | "formula" | "rollup" | "link" | "createdTime" | "lastModifiedTime" | "createdBy" | "lastModifiedBy" | "autoNumber" | "button" | "department" | "createdByDepartment" | "lastModifiedByDepartment";
                /**
                 * @description The description of the field.
                 * @example this is a summary
                 */
                description?: string;
                /** @description The configuration options of the field. The structure of the field's options depend on the field's type. */
                options: ({
                  /** @enum {string} */
                  expression: "countall({values})" | "counta({values})" | "count({values})" | "sum({values})" | "max({values})" | "min({values})" | "and({values})" | "or({values})" | "xor({values})" | "array_join({values})" | "array_unique({values})" | "array_compact({values})" | "concatenate({values})";
                  /** @description The time zone that should be used to format dates */
                  timeZone?: string;
                  /** @description Different cell value types are determined based on the results of expression parsing, where numbers, dates, and formatting options are provided */
                  formatting?: ({
                    /** @description the display formatting of the date. you can use the following presets: M/D/YYYY, D/M/YYYY, YYYY/MM/DD, YYYY-MM-DD, YYYY-MM, MM-DD, YYYY, MM, DD */
                    date: string;
                    /**
                     * @description the display formatting of the time. you can use the following presets: HH:mm, hh:mm A, None
                     * @enum {string}
                     */
                    time: "HH:mm" | "hh:mm A" | "None";
                    /** @description The time zone that should be used to format dates */
                    timeZone: string;
                  }) | {
                    precision: number;
                    /** @enum {string} */
                    type: "decimal";
                  } | {
                    precision: number;
                    /** @enum {string} */
                    type: "percent";
                  } | {
                    precision: number;
                    /** @enum {string} */
                    type: "currency";
                    symbol: string;
                  };
                  /** @description According to the results of expression parsing to determine different visual effects, where strings, numbers will provide customized "show as" */
                  showAs?: ({
                    /**
                     * @description can display as url, email or phone in string field with a button to perform the corresponding action, start a phone call, send an email, or open a link in a new tab
                     * @enum {string}
                     */
                    type: "url" | "email" | "phone";
                  }) | ({
                    /**
                     * @description can display as bar or ring in number field with single cellValue value
                     * @enum {string}
                     */
                    type: "bar" | "ring";
                    /** @enum {string} */
                    color: "blueLight2" | "blueLight1" | "blueBright" | "blue" | "blueDark1" | "cyanLight2" | "cyanLight1" | "cyanBright" | "cyan" | "cyanDark1" | "grayLight2" | "grayLight1" | "grayBright" | "gray" | "grayDark1" | "greenLight2" | "greenLight1" | "greenBright" | "green" | "greenDark1" | "orangeLight2" | "orangeLight1" | "orangeBright" | "orange" | "orangeDark1" | "pinkLight2" | "pinkLight1" | "pinkBright" | "pink" | "pinkDark1" | "purpleLight2" | "purpleLight1" | "purpleBright" | "purple" | "purpleDark1" | "redLight2" | "redLight1" | "redBright" | "red" | "redDark1" | "tealLight2" | "tealLight1" | "tealBright" | "teal" | "tealDark1" | "yellowLight2" | "yellowLight1" | "yellowBright" | "yellow" | "yellowDark1";
                    /** @description whether to displays the specific value on the graph */
                    showValue: boolean;
                    /** @description the value that represents a 100% maximum value, it does not represent a hard limit on the value */
                    maxValue: number;
                  }) | ({
                    /**
                     * @description can display as bar or line in number field with multiple cellValue value
                     * @enum {string}
                     */
                    type: "bar" | "line";
                    /** @enum {string} */
                    color: "blueLight2" | "blueLight1" | "blueBright" | "blue" | "blueDark1" | "cyanLight2" | "cyanLight1" | "cyanBright" | "cyan" | "cyanDark1" | "grayLight2" | "grayLight1" | "grayBright" | "gray" | "grayDark1" | "greenLight2" | "greenLight1" | "greenBright" | "green" | "greenDark1" | "orangeLight2" | "orangeLight1" | "orangeBright" | "orange" | "orangeDark1" | "pinkLight2" | "pinkLight1" | "pinkBright" | "pink" | "pinkDark1" | "purpleLight2" | "purpleLight1" | "purpleBright" | "purple" | "purpleDark1" | "redLight2" | "redLight1" | "redBright" | "red" | "redDark1" | "tealLight2" | "tealLight1" | "tealBright" | "teal" | "tealDark1" | "yellowLight2" | "yellowLight1" | "yellowBright" | "yellow" | "yellowDark1";
                  });
                }) | ({
                  /** @description The formula including fields referenced by their IDs. For example, LEFT(4, {Birthday}) input will be returned as LEFT(4, {fldXXX}) via API. The formula syntax in Teable is basically the same as Airtable */
                  expression: string;
                  /** @description The time zone that should be used to format dates */
                  timeZone?: string;
                  /** @description Different cell value types are determined based on the results of expression parsing, where numbers, dates, and formatting options are provided */
                  formatting?: ({
                    /** @description the display formatting of the date. you can use the following presets: M/D/YYYY, D/M/YYYY, YYYY/MM/DD, YYYY-MM-DD, YYYY-MM, MM-DD, YYYY, MM, DD */
                    date: string;
                    /**
                     * @description the display formatting of the time. you can use the following presets: HH:mm, hh:mm A, None
                     * @enum {string}
                     */
                    time: "HH:mm" | "hh:mm A" | "None";
                    /** @description The time zone that should be used to format dates */
                    timeZone: string;
                  }) | {
                    precision: number;
                    /** @enum {string} */
                    type: "decimal";
                  } | {
                    precision: number;
                    /** @enum {string} */
                    type: "percent";
                  } | {
                    precision: number;
                    /** @enum {string} */
                    type: "currency";
                    symbol: string;
                  };
                  /** @description According to the results of expression parsing to determine different visual effects, where strings, numbers will provide customized "show as" */
                  showAs?: ({
                    /**
                     * @description can display as url, email or phone in string field with a button to perform the corresponding action, start a phone call, send an email, or open a link in a new tab
                     * @enum {string}
                     */
                    type: "url" | "email" | "phone";
                  }) | ({
                    /**
                     * @description can display as bar or ring in number field with single cellValue value
                     * @enum {string}
                     */
                    type: "bar" | "ring";
                    /** @enum {string} */
                    color: "blueLight2" | "blueLight1" | "blueBright" | "blue" | "blueDark1" | "cyanLight2" | "cyanLight1" | "cyanBright" | "cyan" | "cyanDark1" | "grayLight2" | "grayLight1" | "grayBright" | "gray" | "grayDark1" | "greenLight2" | "greenLight1" | "greenBright" | "green" | "greenDark1" | "orangeLight2" | "orangeLight1" | "orangeBright" | "orange" | "orangeDark1" | "pinkLight2" | "pinkLight1" | "pinkBright" | "pink" | "pinkDark1" | "purpleLight2" | "purpleLight1" | "purpleBright" | "purple" | "purpleDark1" | "redLight2" | "redLight1" | "redBright" | "red" | "redDark1" | "tealLight2" | "tealLight1" | "tealBright" | "teal" | "tealDark1" | "yellowLight2" | "yellowLight1" | "yellowBright" | "yellow" | "yellowDark1";
                    /** @description whether to displays the specific value on the graph */
                    showValue: boolean;
                    /** @description the value that represents a 100% maximum value, it does not represent a hard limit on the value */
                    maxValue: number;
                  }) | ({
                    /**
                     * @description can display as bar or line in number field with multiple cellValue value
                     * @enum {string}
                     */
                    type: "bar" | "line";
                    /** @enum {string} */
                    color: "blueLight2" | "blueLight1" | "blueBright" | "blue" | "blueDark1" | "cyanLight2" | "cyanLight1" | "cyanBright" | "cyan" | "cyanDark1" | "grayLight2" | "grayLight1" | "grayBright" | "gray" | "grayDark1" | "greenLight2" | "greenLight1" | "greenBright" | "green" | "greenDark1" | "orangeLight2" | "orangeLight1" | "orangeBright" | "orange" | "orangeDark1" | "pinkLight2" | "pinkLight1" | "pinkBright" | "pink" | "pinkDark1" | "purpleLight2" | "purpleLight1" | "purpleBright" | "purple" | "purpleDark1" | "redLight2" | "redLight1" | "redBright" | "red" | "redDark1" | "tealLight2" | "tealLight1" | "tealBright" | "teal" | "tealDark1" | "yellowLight2" | "yellowLight1" | "yellowBright" | "yellow" | "yellowDark1";
                  });
                }) | ({
                  /** @description the base id of the table that this field is linked to, only required for cross base link */
                  baseId?: string;
                  /**
                   * @description describe the relationship from this table to the foreign table
                   * @enum {string}
                   */
                  relationship: "oneOne" | "manyMany" | "oneMany" | "manyOne";
                  /** @description the table this field is linked to */
                  foreignTableId: string;
                  /** @description the field in the foreign table that will be displayed as the current field */
                  lookupFieldId: string;
                  /** @description whether the field is a one-way link, when true, it will not generate a symmetric field, it is generally has better performance */
                  isOneWay?: boolean;
                  /** @description the table name for storing keys, in many-to-many relationships, keys are stored in a separate intermediate table; in other relationships, keys are stored on one side as needed */
                  fkHostTableName: string;
                  /** @description the name of the field that stores the current table primary key */
                  selfKeyName: string;
                  /** @description The name of the field that stores the foreign table primary key */
                  foreignKeyName: string;
                  /** @description the symmetric field in the foreign table, empty if the field is a one-way link */
                  symmetricFieldId?: string;
                  /** @description the view id that limits the number of records in the link field */
                  filterByViewId?: string | null;
                  /** @description the fields that will be displayed in the link field */
                  visibleFieldIds?: string[] | null;
                  /** @description A filter object for complex query conditions based on fields, operators, and values. Use our visual query builder at https://app.teable.ai/developer/tool/query-builder to build filters. */
                  filter?: Record<string, never>;
                }) | ({
                  /** @description caveat: the formatting is just a formatter, it dose not effect the storing value of the record */
                  formatting: {
                    /** @description the display formatting of the date. you can use the following presets: M/D/YYYY, D/M/YYYY, YYYY/MM/DD, YYYY-MM-DD, YYYY-MM, MM-DD, YYYY, MM, DD */
                    date: string;
                    /**
                     * @description the display formatting of the time. you can use the following presets: HH:mm, hh:mm A, None
                     * @enum {string}
                     */
                    time: "HH:mm" | "hh:mm A" | "None";
                    /** @description The time zone that should be used to format dates */
                    timeZone: string;
                  };
                  /**
                   * @description Whether the new row is automatically filled with the current time, caveat: the defaultValue is just a flag, it dose not effect the storing value of the record
                   * @enum {string}
                   */
                  defaultValue?: "now";
                }) | {
                  defaultValue?: boolean;
                } | Record<string, never> | ({
                  /** @description Only be used in single line text field or formula / rollup field with cellValueType equals String and isMultipleCellValue is not true */
                  showAs?: {
                    /**
                     * @description can display as url, email or phone in string field with a button to perform the corresponding action, start a phone call, send an email, or open a link in a new tab
                     * @enum {string}
                     */
                    type: "url" | "email" | "phone";
                  };
                  defaultValue?: string;
                }) | ({
                  /** @enum {string} */
                  icon: "star" | "moon" | "sun" | "zap" | "flame" | "heart" | "apple" | "thumb-up";
                  /** @enum {string} */
                  color: "yellowBright" | "redBright" | "tealBright";
                  max: number;
                }) | ({
                  /** @description Allow adding multiple users */
                  isMultiple?: boolean;
                  /** @description Notify users when their name is added to a cell */
                  shouldNotify?: boolean;
                  defaultValue?: string | "me" | ((string | "me")[]);
                }) | ({
                  /** @description Button label */
                  label: string;
                  /**
                   * @description Button color
                   * @enum {string}
                   */
                  color: "blueLight2" | "blueLight1" | "blueBright" | "blue" | "blueDark1" | "cyanLight2" | "cyanLight1" | "cyanBright" | "cyan" | "cyanDark1" | "grayLight2" | "grayLight1" | "grayBright" | "gray" | "grayDark1" | "greenLight2" | "greenLight1" | "greenBright" | "green" | "greenDark1" | "orangeLight2" | "orangeLight1" | "orangeBright" | "orange" | "orangeDark1" | "pinkLight2" | "pinkLight1" | "pinkBright" | "pink" | "pinkDark1" | "purpleLight2" | "purpleLight1" | "purpleBright" | "purple" | "purpleDark1" | "redLight2" | "redLight1" | "redBright" | "red" | "redDark1" | "tealLight2" | "tealLight1" | "tealBright" | "teal" | "tealDark1" | "yellowLight2" | "yellowLight1" | "yellowBright" | "yellow" | "yellowDark1";
                  /** @description Max count of button clicks */
                  maxCount?: number;
                  /** @description Reset count */
                  resetCount?: boolean;
                  /** @description Workflow */
                  workflow?: {
                    /** @description Workflow ID */
                    id?: string;
                    /** @description Workflow Name */
                    name?: string;
                    /** @description Workflow is active */
                    isActive?: boolean;
                  } | null;
                }) | ({
                  choices: ({
                      id: string;
                      name: string;
                      /** @enum {string} */
                      color: "blueLight2" | "blueLight1" | "blueBright" | "blue" | "blueDark1" | "cyanLight2" | "cyanLight1" | "cyanBright" | "cyan" | "cyanDark1" | "grayLight2" | "grayLight1" | "grayBright" | "gray" | "grayDark1" | "greenLight2" | "greenLight1" | "greenBright" | "green" | "greenDark1" | "orangeLight2" | "orangeLight1" | "orangeBright" | "orange" | "orangeDark1" | "pinkLight2" | "pinkLight1" | "pinkBright" | "pink" | "pinkDark1" | "purpleLight2" | "purpleLight1" | "purpleBright" | "purple" | "purpleDark1" | "redLight2" | "redLight1" | "redBright" | "red" | "redDark1" | "tealLight2" | "tealLight1" | "tealBright" | "teal" | "tealDark1" | "yellowLight2" | "yellowLight1" | "yellowBright" | "yellow" | "yellowDark1";
                    })[];
                  defaultValue?: string | string[];
                  preventAutoNewOptions?: boolean;
                }) | ({
                  /** @description Only be used in number field (number field or formula / rollup field with cellValueType equals Number */
                  formatting: {
                    precision: number;
                    /** @enum {string} */
                    type: "decimal";
                  } | {
                    precision: number;
                    /** @enum {string} */
                    type: "percent";
                  } | {
                    precision: number;
                    /** @enum {string} */
                    type: "currency";
                    symbol: string;
                  };
                  /** @description Only be used in number field (number field or formula / rollup field with cellValueType equals Number */
                  showAs?: ({
                    /**
                     * @description can display as bar or ring in number field with single cellValue value
                     * @enum {string}
                     */
                    type: "bar" | "ring";
                    /** @enum {string} */
                    color: "blueLight2" | "blueLight1" | "blueBright" | "blue" | "blueDark1" | "cyanLight2" | "cyanLight1" | "cyanBright" | "cyan" | "cyanDark1" | "grayLight2" | "grayLight1" | "grayBright" | "gray" | "grayDark1" | "greenLight2" | "greenLight1" | "greenBright" | "green" | "greenDark1" | "orangeLight2" | "orangeLight1" | "orangeBright" | "orange" | "orangeDark1" | "pinkLight2" | "pinkLight1" | "pinkBright" | "pink" | "pinkDark1" | "purpleLight2" | "purpleLight1" | "purpleBright" | "purple" | "purpleDark1" | "redLight2" | "redLight1" | "redBright" | "red" | "redDark1" | "tealLight2" | "tealLight1" | "tealBright" | "teal" | "tealDark1" | "yellowLight2" | "yellowLight1" | "yellowBright" | "yellow" | "yellowDark1";
                    /** @description whether to displays the specific value on the graph */
                    showValue: boolean;
                    /** @description the value that represents a 100% maximum value, it does not represent a hard limit on the value */
                    maxValue: number;
                  }) | ({
                    /**
                     * @description can display as bar or line in number field with multiple cellValue value
                     * @enum {string}
                     */
                    type: "bar" | "line";
                    /** @enum {string} */
                    color: "blueLight2" | "blueLight1" | "blueBright" | "blue" | "blueDark1" | "cyanLight2" | "cyanLight1" | "cyanBright" | "cyan" | "cyanDark1" | "grayLight2" | "grayLight1" | "grayBright" | "gray" | "grayDark1" | "greenLight2" | "greenLight1" | "greenBright" | "green" | "greenDark1" | "orangeLight2" | "orangeLight1" | "orangeBright" | "orange" | "orangeDark1" | "pinkLight2" | "pinkLight1" | "pinkBright" | "pink" | "pinkDark1" | "purpleLight2" | "purpleLight1" | "purpleBright" | "purple" | "purpleDark1" | "redLight2" | "redLight1" | "redBright" | "red" | "redDark1" | "tealLight2" | "tealLight1" | "tealBright" | "teal" | "tealDark1" | "yellowLight2" | "yellowLight1" | "yellowBright" | "yellow" | "yellowDark1";
                  });
                  defaultValue?: number;
                }) | {
                  /** @enum {string} */
                  expression: "AUTO_NUMBER()";
                } | ({
                  /** @enum {string} */
                  expression: "CREATED_TIME()";
                  /** @description caveat: the formatting is just a formatter, it dose not effect the storing value of the record */
                  formatting: {
                    /** @description the display formatting of the date. you can use the following presets: M/D/YYYY, D/M/YYYY, YYYY/MM/DD, YYYY-MM-DD, YYYY-MM, MM-DD, YYYY, MM, DD */
                    date: string;
                    /**
                     * @description the display formatting of the time. you can use the following presets: HH:mm, hh:mm A, None
                     * @enum {string}
                     */
                    time: "HH:mm" | "hh:mm A" | "None";
                    /** @description The time zone that should be used to format dates */
                    timeZone: string;
                  };
                }) | ({
                  /** @enum {string} */
                  expression: "LAST_MODIFIED_TIME()";
                  /** @description caveat: the formatting is just a formatter, it dose not effect the storing value of the record */
                  formatting: {
                    /** @description the display formatting of the date. you can use the following presets: M/D/YYYY, D/M/YYYY, YYYY/MM/DD, YYYY-MM-DD, YYYY-MM, MM-DD, YYYY, MM, DD */
                    date: string;
                    /**
                     * @description the display formatting of the time. you can use the following presets: HH:mm, hh:mm A, None
                     * @enum {string}
                     */
                    time: "HH:mm" | "hh:mm A" | "None";
                    /** @description The time zone that should be used to format dates */
                    timeZone: string;
                  };
                });
                /** @description The AI configuration of the field. */
                aiConfig?: unknown;
                /** @description Whether this field is lookup field. witch means cellValue and [fieldType] is looked up from the linked table. */
                isLookup?: boolean;
                /** @description field lookup options. */
                lookupOptions?: {
                  /** @description the table this field is linked to */
                  foreignTableId: string;
                  /** @description the field in the foreign table that will be displayed as the current field */
                  lookupFieldId: string;
                  /**
                   * @description describe the relationship from this table to the foreign table
                   * @enum {string}
                   */
                  relationship: "oneOne" | "manyMany" | "oneMany" | "manyOne";
                  /** @description the table name for storing keys, in many-to-many relationships, keys are stored in a separate intermediate table; in other relationships, keys are stored on one side as needed */
                  fkHostTableName: string;
                  /** @description the name of the field that stores the current table primary key */
                  selfKeyName: string;
                  /** @description The name of the field that stores the foreign table primary key */
                  foreignKeyName: string;
                  /** @description A filter object for complex query conditions based on fields, operators, and values. Use our visual query builder at https://app.teable.ai/developer/tool/query-builder to build filters. */
                  filter?: Record<string, never>;
                  /** @description The id of Linked record field to use for lookup */
                  linkFieldId: string;
                };
                /** @description Whether this field is not null. */
                notNull?: boolean;
                /** @description Whether this field is not unique. */
                unique?: boolean;
                /** @description Whether this field is primary field. */
                isPrimary?: boolean;
                /** @description Whether this field is computed field, you can not modify cellValue in computed field. */
                isComputed?: boolean;
                /** @description Whether this field's calculation is pending. */
                isPending?: boolean;
                /** @description Whether This field has a configuration error. Check the fields referenced by this field's formula or configuration. */
                hasError?: boolean;
                /**
                 * @description The cell value type of the field.
                 * @enum {string}
                 */
                cellValueType: "string" | "number" | "boolean" | "dateTime";
                /** @description Whether this field has multiple cell value. */
                isMultipleCellValue?: boolean;
                /**
                 * @description The field type of database that cellValue really store.
                 * @enum {string}
                 */
                dbFieldType: "TEXT" | "INTEGER" | "DATETIME" | "REAL" | "BLOB" | "JSON" | "BOOLEAN";
                /** @description Field(column) name in backend database. Limitation: 1-63 characters, can only contain letters, numbers and underscore, case sensitive, cannot be duplicated with existing db field name in the table. */
                dbFieldName: string;
                /** @description Field record read permission. When set to false, reading records is denied. When true or not set, reading records is allowed. */
                recordRead?: boolean;
                /** @description Field record create permission. When set to false, creating records is denied. When true or not set, creating records is allowed. */
                recordCreate?: boolean;
              })[];
          };
        };
      };
      responses: {
        /** @description Paste successfully */
        200: {
          content: {
            "application/json": {
                /** @description Objects with a fields key mapping fieldId or field name to value for that field. */
                fields: {
                  [key: string]: unknown;
                };
              }[];
          };
        };
      };
    };
  };
  "/table/{tableId}/field/{fieldId}/plan": {
    /** @description Generate calculation plan for the field */
    get: {
      parameters: {
        path: {
          tableId: string;
          fieldId: string;
        };
      };
      responses: {
        /** @description Returns the calculation plan for the field */
        200: {
          content: {
            "application/json": {
              estimateTime: number;
              graph?: {
                nodes: {
                    id: string;
                    label?: string;
                    comboId?: string;
                  }[];
                edges: {
                    source: string;
                    target: string;
                    label?: string;
                  }[];
                combos: {
                    id: string;
                    label: string;
                  }[];
              };
              updateCellCount: number;
              linkFieldCount?: number;
            };
          };
        };
      };
    };
    /** @description Generate calculation plan for converting the field */
    put: {
      parameters: {
        path: {
          tableId: string;
          fieldId: string;
        };
      };
      requestBody?: {
        content: {
          "application/json": {
            /**
             * @description The field types supported by teable.
             * @example singleSelect
             * @enum {string}
             */
            type: "singleLineText" | "longText" | "user" | "attachment" | "checkbox" | "multipleSelect" | "singleSelect" | "date" | "number" | "rating" | "formula" | "rollup" | "link" | "createdTime" | "lastModifiedTime" | "createdBy" | "lastModifiedBy" | "autoNumber" | "button" | "department" | "createdByDepartment" | "lastModifiedByDepartment";
            /**
             * @description The name of the field. can not be duplicated in the table.
             * @example Tags
             */
            name?: string;
            /** @description Whether this field is not unique. */
            unique?: boolean;
            /** @description Whether this field is not null. */
            notNull?: boolean;
            /** @description Field(column) name in backend database. Limitation: 1-63 characters, can only contain letters, numbers and underscore, case sensitive, cannot be duplicated with existing db field name in the table. */
            dbFieldName?: string;
            /** @description Whether this field is lookup field. witch means cellValue and [fieldType] is looked up from the linked table. */
            isLookup?: boolean;
            /**
             * @description The description of the field.
             * @example this is a summary
             */
            description?: string | null;
            /** @description The lookup options for field, you need to configure it when isLookup attribute is true or field type is rollup. */
            lookupOptions?: {
              /** @description the table this field is linked to */
              foreignTableId: string;
              /** @description the field in the foreign table that will be displayed as the current field */
              lookupFieldId: string;
              /** @description The id of Linked record field to use for lookup */
              linkFieldId: string;
              /** @description A filter object for complex query conditions based on fields, operators, and values. Use our visual query builder at https://app.teable.ai/developer/tool/query-builder to build filters. */
              filter?: Record<string, never>;
            };
            /** @description The options of the field. The configuration of the field's options depend on the it's specific type. */
            options?: ({
              /** @enum {string} */
              expression: "countall({values})" | "counta({values})" | "count({values})" | "sum({values})" | "max({values})" | "min({values})" | "and({values})" | "or({values})" | "xor({values})" | "array_join({values})" | "array_unique({values})" | "array_compact({values})" | "concatenate({values})";
              /** @description The time zone that should be used to format dates */
              timeZone?: string;
              /** @description Different cell value types are determined based on the results of expression parsing, where numbers, dates, and formatting options are provided */
              formatting?: ({
                /** @description the display formatting of the date. you can use the following presets: M/D/YYYY, D/M/YYYY, YYYY/MM/DD, YYYY-MM-DD, YYYY-MM, MM-DD, YYYY, MM, DD */
                date: string;
                /**
                 * @description the display formatting of the time. you can use the following presets: HH:mm, hh:mm A, None
                 * @enum {string}
                 */
                time: "HH:mm" | "hh:mm A" | "None";
                /** @description The time zone that should be used to format dates */
                timeZone: string;
              }) | {
                precision: number;
                /** @enum {string} */
                type: "decimal";
              } | {
                precision: number;
                /** @enum {string} */
                type: "percent";
              } | {
                precision: number;
                /** @enum {string} */
                type: "currency";
                symbol: string;
              };
              /** @description According to the results of expression parsing to determine different visual effects, where strings, numbers will provide customized "show as" */
              showAs?: ({
                /**
                 * @description can display as url, email or phone in string field with a button to perform the corresponding action, start a phone call, send an email, or open a link in a new tab
                 * @enum {string}
                 */
                type: "url" | "email" | "phone";
              }) | ({
                /**
                 * @description can display as bar or ring in number field with single cellValue value
                 * @enum {string}
                 */
                type: "bar" | "ring";
                /** @enum {string} */
                color: "blueLight2" | "blueLight1" | "blueBright" | "blue" | "blueDark1" | "cyanLight2" | "cyanLight1" | "cyanBright" | "cyan" | "cyanDark1" | "grayLight2" | "grayLight1" | "grayBright" | "gray" | "grayDark1" | "greenLight2" | "greenLight1" | "greenBright" | "green" | "greenDark1" | "orangeLight2" | "orangeLight1" | "orangeBright" | "orange" | "orangeDark1" | "pinkLight2" | "pinkLight1" | "pinkBright" | "pink" | "pinkDark1" | "purpleLight2" | "purpleLight1" | "purpleBright" | "purple" | "purpleDark1" | "redLight2" | "redLight1" | "redBright" | "red" | "redDark1" | "tealLight2" | "tealLight1" | "tealBright" | "teal" | "tealDark1" | "yellowLight2" | "yellowLight1" | "yellowBright" | "yellow" | "yellowDark1";
                /** @description whether to displays the specific value on the graph */
                showValue: boolean;
                /** @description the value that represents a 100% maximum value, it does not represent a hard limit on the value */
                maxValue: number;
              }) | ({
                /**
                 * @description can display as bar or line in number field with multiple cellValue value
                 * @enum {string}
                 */
                type: "bar" | "line";
                /** @enum {string} */
                color: "blueLight2" | "blueLight1" | "blueBright" | "blue" | "blueDark1" | "cyanLight2" | "cyanLight1" | "cyanBright" | "cyan" | "cyanDark1" | "grayLight2" | "grayLight1" | "grayBright" | "gray" | "grayDark1" | "greenLight2" | "greenLight1" | "greenBright" | "green" | "greenDark1" | "orangeLight2" | "orangeLight1" | "orangeBright" | "orange" | "orangeDark1" | "pinkLight2" | "pinkLight1" | "pinkBright" | "pink" | "pinkDark1" | "purpleLight2" | "purpleLight1" | "purpleBright" | "purple" | "purpleDark1" | "redLight2" | "redLight1" | "redBright" | "red" | "redDark1" | "tealLight2" | "tealLight1" | "tealBright" | "teal" | "tealDark1" | "yellowLight2" | "yellowLight1" | "yellowBright" | "yellow" | "yellowDark1";
              });
            }) | ({
              /** @description The formula including fields referenced by their IDs. For example, LEFT(4, {Birthday}) input will be returned as LEFT(4, {fldXXX}) via API. The formula syntax in Teable is basically the same as Airtable */
              expression: string;
              /** @description The time zone that should be used to format dates */
              timeZone?: string;
              /** @description Different cell value types are determined based on the results of expression parsing, where numbers, dates, and formatting options are provided */
              formatting?: ({
                /** @description the display formatting of the date. you can use the following presets: M/D/YYYY, D/M/YYYY, YYYY/MM/DD, YYYY-MM-DD, YYYY-MM, MM-DD, YYYY, MM, DD */
                date: string;
                /**
                 * @description the display formatting of the time. you can use the following presets: HH:mm, hh:mm A, None
                 * @enum {string}
                 */
                time: "HH:mm" | "hh:mm A" | "None";
                /** @description The time zone that should be used to format dates */
                timeZone: string;
              }) | {
                precision: number;
                /** @enum {string} */
                type: "decimal";
              } | {
                precision: number;
                /** @enum {string} */
                type: "percent";
              } | {
                precision: number;
                /** @enum {string} */
                type: "currency";
                symbol: string;
              };
              /** @description According to the results of expression parsing to determine different visual effects, where strings, numbers will provide customized "show as" */
              showAs?: ({
                /**
                 * @description can display as url, email or phone in string field with a button to perform the corresponding action, start a phone call, send an email, or open a link in a new tab
                 * @enum {string}
                 */
                type: "url" | "email" | "phone";
              }) | ({
                /**
                 * @description can display as bar or ring in number field with single cellValue value
                 * @enum {string}
                 */
                type: "bar" | "ring";
                /** @enum {string} */
                color: "blueLight2" | "blueLight1" | "blueBright" | "blue" | "blueDark1" | "cyanLight2" | "cyanLight1" | "cyanBright" | "cyan" | "cyanDark1" | "grayLight2" | "grayLight1" | "grayBright" | "gray" | "grayDark1" | "greenLight2" | "greenLight1" | "greenBright" | "green" | "greenDark1" | "orangeLight2" | "orangeLight1" | "orangeBright" | "orange" | "orangeDark1" | "pinkLight2" | "pinkLight1" | "pinkBright" | "pink" | "pinkDark1" | "purpleLight2" | "purpleLight1" | "purpleBright" | "purple" | "purpleDark1" | "redLight2" | "redLight1" | "redBright" | "red" | "redDark1" | "tealLight2" | "tealLight1" | "tealBright" | "teal" | "tealDark1" | "yellowLight2" | "yellowLight1" | "yellowBright" | "yellow" | "yellowDark1";
                /** @description whether to displays the specific value on the graph */
                showValue: boolean;
                /** @description the value that represents a 100% maximum value, it does not represent a hard limit on the value */
                maxValue: number;
              }) | ({
                /**
                 * @description can display as bar or line in number field with multiple cellValue value
                 * @enum {string}
                 */
                type: "bar" | "line";
                /** @enum {string} */
                color: "blueLight2" | "blueLight1" | "blueBright" | "blue" | "blueDark1" | "cyanLight2" | "cyanLight1" | "cyanBright" | "cyan" | "cyanDark1" | "grayLight2" | "grayLight1" | "grayBright" | "gray" | "grayDark1" | "greenLight2" | "greenLight1" | "greenBright" | "green" | "greenDark1" | "orangeLight2" | "orangeLight1" | "orangeBright" | "orange" | "orangeDark1" | "pinkLight2" | "pinkLight1" | "pinkBright" | "pink" | "pinkDark1" | "purpleLight2" | "purpleLight1" | "purpleBright" | "purple" | "purpleDark1" | "redLight2" | "redLight1" | "redBright" | "red" | "redDark1" | "tealLight2" | "tealLight1" | "tealBright" | "teal" | "tealDark1" | "yellowLight2" | "yellowLight1" | "yellowBright" | "yellow" | "yellowDark1";
              });
            }) | ({
              /** @description the base id of the table that this field is linked to, only required for cross base link */
              baseId?: string;
              /**
               * @description describe the relationship from this table to the foreign table
               * @enum {string}
               */
              relationship: "oneOne" | "manyMany" | "oneMany" | "manyOne";
              /** @description the table this field is linked to */
              foreignTableId: string;
              /** @description the field in the foreign table that will be displayed as the current field */
              lookupFieldId: string;
              /** @description whether the field is a one-way link, when true, it will not generate a symmetric field, it is generally has better performance */
              isOneWay?: boolean;
              /** @description the table name for storing keys, in many-to-many relationships, keys are stored in a separate intermediate table; in other relationships, keys are stored on one side as needed */
              fkHostTableName: string;
              /** @description the name of the field that stores the current table primary key */
              selfKeyName: string;
              /** @description The name of the field that stores the foreign table primary key */
              foreignKeyName: string;
              /** @description the symmetric field in the foreign table, empty if the field is a one-way link */
              symmetricFieldId?: string;
              /** @description the view id that limits the number of records in the link field */
              filterByViewId?: string | null;
              /** @description the fields that will be displayed in the link field */
              visibleFieldIds?: string[] | null;
              /** @description A filter object for complex query conditions based on fields, operators, and values. Use our visual query builder at https://app.teable.ai/developer/tool/query-builder to build filters. */
              filter?: Record<string, never>;
            }) | ({
              /** @description caveat: the formatting is just a formatter, it dose not effect the storing value of the record */
              formatting: {
                /** @description the display formatting of the date. you can use the following presets: M/D/YYYY, D/M/YYYY, YYYY/MM/DD, YYYY-MM-DD, YYYY-MM, MM-DD, YYYY, MM, DD */
                date: string;
                /**
                 * @description the display formatting of the time. you can use the following presets: HH:mm, hh:mm A, None
                 * @enum {string}
                 */
                time: "HH:mm" | "hh:mm A" | "None";
                /** @description The time zone that should be used to format dates */
                timeZone: string;
              };
              /**
               * @description Whether the new row is automatically filled with the current time, caveat: the defaultValue is just a flag, it dose not effect the storing value of the record
               * @enum {string}
               */
              defaultValue?: "now";
            }) | {
              defaultValue?: boolean;
            } | Record<string, never> | ({
              /** @description Only be used in single line text field or formula / rollup field with cellValueType equals String and isMultipleCellValue is not true */
              showAs?: {
                /**
                 * @description can display as url, email or phone in string field with a button to perform the corresponding action, start a phone call, send an email, or open a link in a new tab
                 * @enum {string}
                 */
                type: "url" | "email" | "phone";
              };
              defaultValue?: string;
            }) | ({
              /** @enum {string} */
              icon: "star" | "moon" | "sun" | "zap" | "flame" | "heart" | "apple" | "thumb-up";
              /** @enum {string} */
              color: "yellowBright" | "redBright" | "tealBright";
              max: number;
            }) | ({
              /** @description Allow adding multiple users */
              isMultiple?: boolean;
              /** @description Notify users when their name is added to a cell */
              shouldNotify?: boolean;
              defaultValue?: string | "me" | ((string | "me")[]);
            }) | ({
              /** @description Button label */
              label: string;
              /**
               * @description Button color
               * @enum {string}
               */
              color: "blueLight2" | "blueLight1" | "blueBright" | "blue" | "blueDark1" | "cyanLight2" | "cyanLight1" | "cyanBright" | "cyan" | "cyanDark1" | "grayLight2" | "grayLight1" | "grayBright" | "gray" | "grayDark1" | "greenLight2" | "greenLight1" | "greenBright" | "green" | "greenDark1" | "orangeLight2" | "orangeLight1" | "orangeBright" | "orange" | "orangeDark1" | "pinkLight2" | "pinkLight1" | "pinkBright" | "pink" | "pinkDark1" | "purpleLight2" | "purpleLight1" | "purpleBright" | "purple" | "purpleDark1" | "redLight2" | "redLight1" | "redBright" | "red" | "redDark1" | "tealLight2" | "tealLight1" | "tealBright" | "teal" | "tealDark1" | "yellowLight2" | "yellowLight1" | "yellowBright" | "yellow" | "yellowDark1";
              /** @description Max count of button clicks */
              maxCount?: number;
              /** @description Reset count */
              resetCount?: boolean;
              /** @description Workflow */
              workflow?: {
                /** @description Workflow ID */
                id?: string;
                /** @description Workflow Name */
                name?: string;
                /** @description Workflow is active */
                isActive?: boolean;
              } | null;
            }) | ({
              /** @description the base id of the table that this field is linked to, only required for cross base link */
              baseId?: string;
              /**
               * @description describe the relationship from this table to the foreign table
               * @enum {string}
               */
              relationship: "oneOne" | "manyMany" | "oneMany" | "manyOne";
              /** @description the table this field is linked to */
              foreignTableId: string;
              /** @description whether the field is a one-way link, when true, it will not generate a symmetric field, it is generally has better performance */
              isOneWay?: boolean;
              /** @description the view id that limits the number of records in the link field */
              filterByViewId?: string | null;
              /** @description the fields that will be displayed in the link field */
              visibleFieldIds?: string[] | null;
              /** @description A filter object for complex query conditions based on fields, operators, and values. Use our visual query builder at https://app.teable.ai/developer/tool/query-builder to build filters. */
              filter?: Record<string, never>;
              /** @description Link field will display the value of this field from the foreign table, if not provided, it will use the primary field of the foreign table, in common case you can safely ignore it */
              lookupFieldId?: string;
            }) | ({
              choices: ({
                  id?: string;
                  name: string;
                  /** @enum {string} */
                  color?: "blueLight2" | "blueLight1" | "blueBright" | "blue" | "blueDark1" | "cyanLight2" | "cyanLight1" | "cyanBright" | "cyan" | "cyanDark1" | "grayLight2" | "grayLight1" | "grayBright" | "gray" | "grayDark1" | "greenLight2" | "greenLight1" | "greenBright" | "green" | "greenDark1" | "orangeLight2" | "orangeLight1" | "orangeBright" | "orange" | "orangeDark1" | "pinkLight2" | "pinkLight1" | "pinkBright" | "pink" | "pinkDark1" | "purpleLight2" | "purpleLight1" | "purpleBright" | "purple" | "purpleDark1" | "redLight2" | "redLight1" | "redBright" | "red" | "redDark1" | "tealLight2" | "tealLight1" | "tealBright" | "teal" | "tealDark1" | "yellowLight2" | "yellowLight1" | "yellowBright" | "yellow" | "yellowDark1";
                })[];
              defaultValue?: string | string[];
              preventAutoNewOptions?: boolean;
            }) | ({
              /** @description Only be used in number field (number field or formula / rollup field with cellValueType equals Number */
              formatting?: {
                precision: number;
                /** @enum {string} */
                type: "decimal";
              } | {
                precision: number;
                /** @enum {string} */
                type: "percent";
              } | {
                precision: number;
                /** @enum {string} */
                type: "currency";
                symbol: string;
              };
              /** @description Only be used in number field (number field or formula / rollup field with cellValueType equals Number */
              showAs?: ({
                /**
                 * @description can display as bar or ring in number field with single cellValue value
                 * @enum {string}
                 */
                type: "bar" | "ring";
                /** @enum {string} */
                color: "blueLight2" | "blueLight1" | "blueBright" | "blue" | "blueDark1" | "cyanLight2" | "cyanLight1" | "cyanBright" | "cyan" | "cyanDark1" | "grayLight2" | "grayLight1" | "grayBright" | "gray" | "grayDark1" | "greenLight2" | "greenLight1" | "greenBright" | "green" | "greenDark1" | "orangeLight2" | "orangeLight1" | "orangeBright" | "orange" | "orangeDark1" | "pinkLight2" | "pinkLight1" | "pinkBright" | "pink" | "pinkDark1" | "purpleLight2" | "purpleLight1" | "purpleBright" | "purple" | "purpleDark1" | "redLight2" | "redLight1" | "redBright" | "red" | "redDark1" | "tealLight2" | "tealLight1" | "tealBright" | "teal" | "tealDark1" | "yellowLight2" | "yellowLight1" | "yellowBright" | "yellow" | "yellowDark1";
                /** @description whether to displays the specific value on the graph */
                showValue: boolean;
                /** @description the value that represents a 100% maximum value, it does not represent a hard limit on the value */
                maxValue: number;
              }) | ({
                /**
                 * @description can display as bar or line in number field with multiple cellValue value
                 * @enum {string}
                 */
                type: "bar" | "line";
                /** @enum {string} */
                color: "blueLight2" | "blueLight1" | "blueBright" | "blue" | "blueDark1" | "cyanLight2" | "cyanLight1" | "cyanBright" | "cyan" | "cyanDark1" | "grayLight2" | "grayLight1" | "grayBright" | "gray" | "grayDark1" | "greenLight2" | "greenLight1" | "greenBright" | "green" | "greenDark1" | "orangeLight2" | "orangeLight1" | "orangeBright" | "orange" | "orangeDark1" | "pinkLight2" | "pinkLight1" | "pinkBright" | "pink" | "pinkDark1" | "purpleLight2" | "purpleLight1" | "purpleBright" | "purple" | "purpleDark1" | "redLight2" | "redLight1" | "redBright" | "red" | "redDark1" | "tealLight2" | "tealLight1" | "tealBright" | "teal" | "tealDark1" | "yellowLight2" | "yellowLight1" | "yellowBright" | "yellow" | "yellowDark1";
              });
              defaultValue?: number;
            }) | ({
              /** @description caveat: the formatting is just a formatter, it dose not effect the storing value of the record */
              formatting: {
                /** @description the display formatting of the date. you can use the following presets: M/D/YYYY, D/M/YYYY, YYYY/MM/DD, YYYY-MM-DD, YYYY-MM, MM-DD, YYYY, MM, DD */
                date: string;
                /**
                 * @description the display formatting of the time. you can use the following presets: HH:mm, hh:mm A, None
                 * @enum {string}
                 */
                time: "HH:mm" | "hh:mm A" | "None";
                /** @description The time zone that should be used to format dates */
                timeZone: string;
              };
            });
            /** @description The AI configuration of the field. */
            aiConfig?: unknown;
          };
        };
      };
      responses: {
        /** @description Returns the calculation plan */
        201: {
          content: {
            "application/json": {
              estimateTime?: number;
              graph?: {
                nodes: {
                    id: string;
                    label?: string;
                    comboId?: string;
                  }[];
                edges: {
                    source: string;
                    target: string;
                    label?: string;
                  }[];
                combos: {
                    id: string;
                    label: string;
                  }[];
              };
              updateCellCount?: number;
              linkFieldCount?: number;
              skip?: boolean;
            };
          };
        };
      };
    };
    /** @description Generate calculation plan for deleting the field */
    delete: {
      parameters: {
        path: {
          tableId: string;
          fieldId: string;
        };
      };
      responses: {
        /** @description Returns the calculation plan for deleting the field */
        200: {
          content: {
            "application/json": {
              estimateTime?: number;
              graph?: {
                nodes: {
                    id: string;
                    label?: string;
                    comboId?: string;
                  }[];
                edges: {
                    source: string;
                    target: string;
                    label?: string;
                  }[];
                combos: {
                    id: string;
                    label: string;
                  }[];
              };
              updateCellCount?: number;
              linkFieldCount?: number;
            };
          };
        };
      };
    };
  };
  "/table/{tableId}/field/plan": {
    /** @description Generate calculation plan for creating the field */
    post: {
      parameters: {
        path: {
          tableId: string;
        };
      };
      requestBody?: {
        content: {
          "application/json": {
            /**
             * @description The field types supported by teable.
             * @example singleSelect
             * @enum {string}
             */
            type: "singleLineText" | "longText" | "user" | "attachment" | "checkbox" | "multipleSelect" | "singleSelect" | "date" | "number" | "rating" | "formula" | "rollup" | "link" | "createdTime" | "lastModifiedTime" | "createdBy" | "lastModifiedBy" | "autoNumber" | "button" | "department" | "createdByDepartment" | "lastModifiedByDepartment";
            /**
             * @description The name of the field. can not be duplicated in the table.
             * @example Tags
             */
            name?: string;
            /** @description Whether this field is not unique. */
            unique?: boolean;
            /** @description Whether this field is not null. */
            notNull?: boolean;
            /** @description Field(column) name in backend database. Limitation: 1-63 characters, can only contain letters, numbers and underscore, case sensitive, cannot be duplicated with existing db field name in the table. */
            dbFieldName?: string;
            /** @description Whether this field is lookup field. witch means cellValue and [fieldType] is looked up from the linked table. */
            isLookup?: boolean;
            /**
             * @description The description of the field.
             * @example this is a summary
             */
            description?: string | null;
            /** @description The lookup options for field, you need to configure it when isLookup attribute is true or field type is rollup. */
            lookupOptions?: {
              /** @description the table this field is linked to */
              foreignTableId: string;
              /** @description the field in the foreign table that will be displayed as the current field */
              lookupFieldId: string;
              /** @description The id of Linked record field to use for lookup */
              linkFieldId: string;
              /** @description A filter object for complex query conditions based on fields, operators, and values. Use our visual query builder at https://app.teable.ai/developer/tool/query-builder to build filters. */
              filter?: Record<string, never>;
            };
            /** @description The options of the field. The configuration of the field's options depend on the it's specific type. */
            options?: ({
              /** @enum {string} */
              expression: "countall({values})" | "counta({values})" | "count({values})" | "sum({values})" | "max({values})" | "min({values})" | "and({values})" | "or({values})" | "xor({values})" | "array_join({values})" | "array_unique({values})" | "array_compact({values})" | "concatenate({values})";
              /** @description The time zone that should be used to format dates */
              timeZone?: string;
              /** @description Different cell value types are determined based on the results of expression parsing, where numbers, dates, and formatting options are provided */
              formatting?: ({
                /** @description the display formatting of the date. you can use the following presets: M/D/YYYY, D/M/YYYY, YYYY/MM/DD, YYYY-MM-DD, YYYY-MM, MM-DD, YYYY, MM, DD */
                date: string;
                /**
                 * @description the display formatting of the time. you can use the following presets: HH:mm, hh:mm A, None
                 * @enum {string}
                 */
                time: "HH:mm" | "hh:mm A" | "None";
                /** @description The time zone that should be used to format dates */
                timeZone: string;
              }) | {
                precision: number;
                /** @enum {string} */
                type: "decimal";
              } | {
                precision: number;
                /** @enum {string} */
                type: "percent";
              } | {
                precision: number;
                /** @enum {string} */
                type: "currency";
                symbol: string;
              };
              /** @description According to the results of expression parsing to determine different visual effects, where strings, numbers will provide customized "show as" */
              showAs?: ({
                /**
                 * @description can display as url, email or phone in string field with a button to perform the corresponding action, start a phone call, send an email, or open a link in a new tab
                 * @enum {string}
                 */
                type: "url" | "email" | "phone";
              }) | ({
                /**
                 * @description can display as bar or ring in number field with single cellValue value
                 * @enum {string}
                 */
                type: "bar" | "ring";
                /** @enum {string} */
                color: "blueLight2" | "blueLight1" | "blueBright" | "blue" | "blueDark1" | "cyanLight2" | "cyanLight1" | "cyanBright" | "cyan" | "cyanDark1" | "grayLight2" | "grayLight1" | "grayBright" | "gray" | "grayDark1" | "greenLight2" | "greenLight1" | "greenBright" | "green" | "greenDark1" | "orangeLight2" | "orangeLight1" | "orangeBright" | "orange" | "orangeDark1" | "pinkLight2" | "pinkLight1" | "pinkBright" | "pink" | "pinkDark1" | "purpleLight2" | "purpleLight1" | "purpleBright" | "purple" | "purpleDark1" | "redLight2" | "redLight1" | "redBright" | "red" | "redDark1" | "tealLight2" | "tealLight1" | "tealBright" | "teal" | "tealDark1" | "yellowLight2" | "yellowLight1" | "yellowBright" | "yellow" | "yellowDark1";
                /** @description whether to displays the specific value on the graph */
                showValue: boolean;
                /** @description the value that represents a 100% maximum value, it does not represent a hard limit on the value */
                maxValue: number;
              }) | ({
                /**
                 * @description can display as bar or line in number field with multiple cellValue value
                 * @enum {string}
                 */
                type: "bar" | "line";
                /** @enum {string} */
                color: "blueLight2" | "blueLight1" | "blueBright" | "blue" | "blueDark1" | "cyanLight2" | "cyanLight1" | "cyanBright" | "cyan" | "cyanDark1" | "grayLight2" | "grayLight1" | "grayBright" | "gray" | "grayDark1" | "greenLight2" | "greenLight1" | "greenBright" | "green" | "greenDark1" | "orangeLight2" | "orangeLight1" | "orangeBright" | "orange" | "orangeDark1" | "pinkLight2" | "pinkLight1" | "pinkBright" | "pink" | "pinkDark1" | "purpleLight2" | "purpleLight1" | "purpleBright" | "purple" | "purpleDark1" | "redLight2" | "redLight1" | "redBright" | "red" | "redDark1" | "tealLight2" | "tealLight1" | "tealBright" | "teal" | "tealDark1" | "yellowLight2" | "yellowLight1" | "yellowBright" | "yellow" | "yellowDark1";
              });
            }) | ({
              /** @description The formula including fields referenced by their IDs. For example, LEFT(4, {Birthday}) input will be returned as LEFT(4, {fldXXX}) via API. The formula syntax in Teable is basically the same as Airtable */
              expression: string;
              /** @description The time zone that should be used to format dates */
              timeZone?: string;
              /** @description Different cell value types are determined based on the results of expression parsing, where numbers, dates, and formatting options are provided */
              formatting?: ({
                /** @description the display formatting of the date. you can use the following presets: M/D/YYYY, D/M/YYYY, YYYY/MM/DD, YYYY-MM-DD, YYYY-MM, MM-DD, YYYY, MM, DD */
                date: string;
                /**
                 * @description the display formatting of the time. you can use the following presets: HH:mm, hh:mm A, None
                 * @enum {string}
                 */
                time: "HH:mm" | "hh:mm A" | "None";
                /** @description The time zone that should be used to format dates */
                timeZone: string;
              }) | {
                precision: number;
                /** @enum {string} */
                type: "decimal";
              } | {
                precision: number;
                /** @enum {string} */
                type: "percent";
              } | {
                precision: number;
                /** @enum {string} */
                type: "currency";
                symbol: string;
              };
              /** @description According to the results of expression parsing to determine different visual effects, where strings, numbers will provide customized "show as" */
              showAs?: ({
                /**
                 * @description can display as url, email or phone in string field with a button to perform the corresponding action, start a phone call, send an email, or open a link in a new tab
                 * @enum {string}
                 */
                type: "url" | "email" | "phone";
              }) | ({
                /**
                 * @description can display as bar or ring in number field with single cellValue value
                 * @enum {string}
                 */
                type: "bar" | "ring";
                /** @enum {string} */
                color: "blueLight2" | "blueLight1" | "blueBright" | "blue" | "blueDark1" | "cyanLight2" | "cyanLight1" | "cyanBright" | "cyan" | "cyanDark1" | "grayLight2" | "grayLight1" | "grayBright" | "gray" | "grayDark1" | "greenLight2" | "greenLight1" | "greenBright" | "green" | "greenDark1" | "orangeLight2" | "orangeLight1" | "orangeBright" | "orange" | "orangeDark1" | "pinkLight2" | "pinkLight1" | "pinkBright" | "pink" | "pinkDark1" | "purpleLight2" | "purpleLight1" | "purpleBright" | "purple" | "purpleDark1" | "redLight2" | "redLight1" | "redBright" | "red" | "redDark1" | "tealLight2" | "tealLight1" | "tealBright" | "teal" | "tealDark1" | "yellowLight2" | "yellowLight1" | "yellowBright" | "yellow" | "yellowDark1";
                /** @description whether to displays the specific value on the graph */
                showValue: boolean;
                /** @description the value that represents a 100% maximum value, it does not represent a hard limit on the value */
                maxValue: number;
              }) | ({
                /**
                 * @description can display as bar or line in number field with multiple cellValue value
                 * @enum {string}
                 */
                type: "bar" | "line";
                /** @enum {string} */
                color: "blueLight2" | "blueLight1" | "blueBright" | "blue" | "blueDark1" | "cyanLight2" | "cyanLight1" | "cyanBright" | "cyan" | "cyanDark1" | "grayLight2" | "grayLight1" | "grayBright" | "gray" | "grayDark1" | "greenLight2" | "greenLight1" | "greenBright" | "green" | "greenDark1" | "orangeLight2" | "orangeLight1" | "orangeBright" | "orange" | "orangeDark1" | "pinkLight2" | "pinkLight1" | "pinkBright" | "pink" | "pinkDark1" | "purpleLight2" | "purpleLight1" | "purpleBright" | "purple" | "purpleDark1" | "redLight2" | "redLight1" | "redBright" | "red" | "redDark1" | "tealLight2" | "tealLight1" | "tealBright" | "teal" | "tealDark1" | "yellowLight2" | "yellowLight1" | "yellowBright" | "yellow" | "yellowDark1";
              });
            }) | ({
              /** @description the base id of the table that this field is linked to, only required for cross base link */
              baseId?: string;
              /**
               * @description describe the relationship from this table to the foreign table
               * @enum {string}
               */
              relationship: "oneOne" | "manyMany" | "oneMany" | "manyOne";
              /** @description the table this field is linked to */
              foreignTableId: string;
              /** @description the field in the foreign table that will be displayed as the current field */
              lookupFieldId: string;
              /** @description whether the field is a one-way link, when true, it will not generate a symmetric field, it is generally has better performance */
              isOneWay?: boolean;
              /** @description the table name for storing keys, in many-to-many relationships, keys are stored in a separate intermediate table; in other relationships, keys are stored on one side as needed */
              fkHostTableName: string;
              /** @description the name of the field that stores the current table primary key */
              selfKeyName: string;
              /** @description The name of the field that stores the foreign table primary key */
              foreignKeyName: string;
              /** @description the symmetric field in the foreign table, empty if the field is a one-way link */
              symmetricFieldId?: string;
              /** @description the view id that limits the number of records in the link field */
              filterByViewId?: string | null;
              /** @description the fields that will be displayed in the link field */
              visibleFieldIds?: string[] | null;
              /** @description A filter object for complex query conditions based on fields, operators, and values. Use our visual query builder at https://app.teable.ai/developer/tool/query-builder to build filters. */
              filter?: Record<string, never>;
            }) | ({
              /** @description caveat: the formatting is just a formatter, it dose not effect the storing value of the record */
              formatting: {
                /** @description the display formatting of the date. you can use the following presets: M/D/YYYY, D/M/YYYY, YYYY/MM/DD, YYYY-MM-DD, YYYY-MM, MM-DD, YYYY, MM, DD */
                date: string;
                /**
                 * @description the display formatting of the time. you can use the following presets: HH:mm, hh:mm A, None
                 * @enum {string}
                 */
                time: "HH:mm" | "hh:mm A" | "None";
                /** @description The time zone that should be used to format dates */
                timeZone: string;
              };
              /**
               * @description Whether the new row is automatically filled with the current time, caveat: the defaultValue is just a flag, it dose not effect the storing value of the record
               * @enum {string}
               */
              defaultValue?: "now";
            }) | {
              defaultValue?: boolean;
            } | Record<string, never> | ({
              /** @description Only be used in single line text field or formula / rollup field with cellValueType equals String and isMultipleCellValue is not true */
              showAs?: {
                /**
                 * @description can display as url, email or phone in string field with a button to perform the corresponding action, start a phone call, send an email, or open a link in a new tab
                 * @enum {string}
                 */
                type: "url" | "email" | "phone";
              };
              defaultValue?: string;
            }) | ({
              /** @enum {string} */
              icon: "star" | "moon" | "sun" | "zap" | "flame" | "heart" | "apple" | "thumb-up";
              /** @enum {string} */
              color: "yellowBright" | "redBright" | "tealBright";
              max: number;
            }) | ({
              /** @description Allow adding multiple users */
              isMultiple?: boolean;
              /** @description Notify users when their name is added to a cell */
              shouldNotify?: boolean;
              defaultValue?: string | "me" | ((string | "me")[]);
            }) | ({
              /** @description Button label */
              label: string;
              /**
               * @description Button color
               * @enum {string}
               */
              color: "blueLight2" | "blueLight1" | "blueBright" | "blue" | "blueDark1" | "cyanLight2" | "cyanLight1" | "cyanBright" | "cyan" | "cyanDark1" | "grayLight2" | "grayLight1" | "grayBright" | "gray" | "grayDark1" | "greenLight2" | "greenLight1" | "greenBright" | "green" | "greenDark1" | "orangeLight2" | "orangeLight1" | "orangeBright" | "orange" | "orangeDark1" | "pinkLight2" | "pinkLight1" | "pinkBright" | "pink" | "pinkDark1" | "purpleLight2" | "purpleLight1" | "purpleBright" | "purple" | "purpleDark1" | "redLight2" | "redLight1" | "redBright" | "red" | "redDark1" | "tealLight2" | "tealLight1" | "tealBright" | "teal" | "tealDark1" | "yellowLight2" | "yellowLight1" | "yellowBright" | "yellow" | "yellowDark1";
              /** @description Max count of button clicks */
              maxCount?: number;
              /** @description Reset count */
              resetCount?: boolean;
              /** @description Workflow */
              workflow?: {
                /** @description Workflow ID */
                id?: string;
                /** @description Workflow Name */
                name?: string;
                /** @description Workflow is active */
                isActive?: boolean;
              } | null;
            }) | ({
              /** @description the base id of the table that this field is linked to, only required for cross base link */
              baseId?: string;
              /**
               * @description describe the relationship from this table to the foreign table
               * @enum {string}
               */
              relationship: "oneOne" | "manyMany" | "oneMany" | "manyOne";
              /** @description the table this field is linked to */
              foreignTableId: string;
              /** @description whether the field is a one-way link, when true, it will not generate a symmetric field, it is generally has better performance */
              isOneWay?: boolean;
              /** @description the view id that limits the number of records in the link field */
              filterByViewId?: string | null;
              /** @description the fields that will be displayed in the link field */
              visibleFieldIds?: string[] | null;
              /** @description A filter object for complex query conditions based on fields, operators, and values. Use our visual query builder at https://app.teable.ai/developer/tool/query-builder to build filters. */
              filter?: Record<string, never>;
              /** @description Link field will display the value of this field from the foreign table, if not provided, it will use the primary field of the foreign table, in common case you can safely ignore it */
              lookupFieldId?: string;
            }) | ({
              choices: ({
                  id?: string;
                  name: string;
                  /** @enum {string} */
                  color?: "blueLight2" | "blueLight1" | "blueBright" | "blue" | "blueDark1" | "cyanLight2" | "cyanLight1" | "cyanBright" | "cyan" | "cyanDark1" | "grayLight2" | "grayLight1" | "grayBright" | "gray" | "grayDark1" | "greenLight2" | "greenLight1" | "greenBright" | "green" | "greenDark1" | "orangeLight2" | "orangeLight1" | "orangeBright" | "orange" | "orangeDark1" | "pinkLight2" | "pinkLight1" | "pinkBright" | "pink" | "pinkDark1" | "purpleLight2" | "purpleLight1" | "purpleBright" | "purple" | "purpleDark1" | "redLight2" | "redLight1" | "redBright" | "red" | "redDark1" | "tealLight2" | "tealLight1" | "tealBright" | "teal" | "tealDark1" | "yellowLight2" | "yellowLight1" | "yellowBright" | "yellow" | "yellowDark1";
                })[];
              defaultValue?: string | string[];
              preventAutoNewOptions?: boolean;
            }) | ({
              /** @description Only be used in number field (number field or formula / rollup field with cellValueType equals Number */
              formatting?: {
                precision: number;
                /** @enum {string} */
                type: "decimal";
              } | {
                precision: number;
                /** @enum {string} */
                type: "percent";
              } | {
                precision: number;
                /** @enum {string} */
                type: "currency";
                symbol: string;
              };
              /** @description Only be used in number field (number field or formula / rollup field with cellValueType equals Number */
              showAs?: ({
                /**
                 * @description can display as bar or ring in number field with single cellValue value
                 * @enum {string}
                 */
                type: "bar" | "ring";
                /** @enum {string} */
                color: "blueLight2" | "blueLight1" | "blueBright" | "blue" | "blueDark1" | "cyanLight2" | "cyanLight1" | "cyanBright" | "cyan" | "cyanDark1" | "grayLight2" | "grayLight1" | "grayBright" | "gray" | "grayDark1" | "greenLight2" | "greenLight1" | "greenBright" | "green" | "greenDark1" | "orangeLight2" | "orangeLight1" | "orangeBright" | "orange" | "orangeDark1" | "pinkLight2" | "pinkLight1" | "pinkBright" | "pink" | "pinkDark1" | "purpleLight2" | "purpleLight1" | "purpleBright" | "purple" | "purpleDark1" | "redLight2" | "redLight1" | "redBright" | "red" | "redDark1" | "tealLight2" | "tealLight1" | "tealBright" | "teal" | "tealDark1" | "yellowLight2" | "yellowLight1" | "yellowBright" | "yellow" | "yellowDark1";
                /** @description whether to displays the specific value on the graph */
                showValue: boolean;
                /** @description the value that represents a 100% maximum value, it does not represent a hard limit on the value */
                maxValue: number;
              }) | ({
                /**
                 * @description can display as bar or line in number field with multiple cellValue value
                 * @enum {string}
                 */
                type: "bar" | "line";
                /** @enum {string} */
                color: "blueLight2" | "blueLight1" | "blueBright" | "blue" | "blueDark1" | "cyanLight2" | "cyanLight1" | "cyanBright" | "cyan" | "cyanDark1" | "grayLight2" | "grayLight1" | "grayBright" | "gray" | "grayDark1" | "greenLight2" | "greenLight1" | "greenBright" | "green" | "greenDark1" | "orangeLight2" | "orangeLight1" | "orangeBright" | "orange" | "orangeDark1" | "pinkLight2" | "pinkLight1" | "pinkBright" | "pink" | "pinkDark1" | "purpleLight2" | "purpleLight1" | "purpleBright" | "purple" | "purpleDark1" | "redLight2" | "redLight1" | "redBright" | "red" | "redDark1" | "tealLight2" | "tealLight1" | "tealBright" | "teal" | "tealDark1" | "yellowLight2" | "yellowLight1" | "yellowBright" | "yellow" | "yellowDark1";
              });
              defaultValue?: number;
            }) | ({
              /** @description caveat: the formatting is just a formatter, it dose not effect the storing value of the record */
              formatting: {
                /** @description the display formatting of the date. you can use the following presets: M/D/YYYY, D/M/YYYY, YYYY/MM/DD, YYYY-MM-DD, YYYY-MM, MM-DD, YYYY, MM, DD */
                date: string;
                /**
                 * @description the display formatting of the time. you can use the following presets: HH:mm, hh:mm A, None
                 * @enum {string}
                 */
                time: "HH:mm" | "hh:mm A" | "None";
                /** @description The time zone that should be used to format dates */
                timeZone: string;
              };
            });
            /** @description The AI configuration of the field. */
            aiConfig?: unknown;
            /**
             * @description The id of the field that start with "fld", followed by exactly 16 alphanumeric characters `/^fld[\da-zA-Z]{16}$/`. It is sometimes useful to specify an id at creation time
             * @example fldxxxxxxxxxxxxxxxx
             */
            id?: string;
            order?: {
              /** @description You can only specify order in one view when create field */
              viewId: string;
              orderIndex: number;
            };
          };
        };
      };
      responses: {
        /** @description Returns the calculation plan for creating the field */
        201: {
          content: {
            "application/json": {
              estimateTime: number;
              graph?: {
                nodes: {
                    id: string;
                    label?: string;
                    comboId?: string;
                  }[];
                edges: {
                    source: string;
                    target: string;
                    label?: string;
                  }[];
                combos: {
                    id: string;
                    label: string;
                  }[];
              };
              updateCellCount: number;
              linkFieldCount?: number;
            };
          };
        };
      };
    };
  };
  "/user/name": {
    /** @description Update user name */
    patch: {
      requestBody?: {
        content: {
          "application/json": {
            name: string;
          };
        };
      };
      responses: {
        /** @description Successfully update. */
        200: {
          content: never;
        };
      };
    };
  };
  "/user/avatar": {
    /** @description Update user avatar */
    patch: {
      requestBody?: {
        content: {
          "multipart/form-data": {
            /** Format: binary */
            file: string;
          };
        };
      };
      responses: {
        /** @description Successfully update. */
        200: {
          content: never;
        };
      };
    };
  };
  "/user/notify-meta": {
    /** @description Update user notification meta */
    patch: {
      requestBody?: {
        content: {
          "application/json": {
            email?: boolean;
          };
        };
      };
      responses: {
        /** @description Successfully update. */
        200: {
          content: never;
        };
      };
    };
  };
  "/user/last-visit": {
    /** @description Get user last visited resource */
    get: {
      parameters: {
        query: {
          resourceType: "base" | "table" | "view" | "dashboard" | "automation";
          parentResourceId: string;
        };
      };
      responses: {
        /** @description Returns data about user last visit. */
        200: {
          content: {
            "application/json": {
              /** @enum {string} */
              resourceType: "base" | "table" | "view" | "dashboard" | "automation";
              resourceId: string;
              childResourceId?: string;
            };
          };
        };
      };
    };
    /** @description Update or create user last visit record */
    post: {
      requestBody?: {
        content: {
          "application/json": {
            /** @enum {string} */
            resourceType: "base" | "table" | "view" | "dashboard" | "automation";
            resourceId: string;
            parentResourceId: string;
            childResourceId?: string;
          };
        };
      };
      responses: {
        /** @description Successfully updated user last visit record. */
        201: {
          content: never;
        };
      };
    };
  };
  "/user/last-visit/map": {
    /** @description Get user last visited resource map */
    get: {
      parameters: {
        query: {
          resourceType: "base" | "table" | "view" | "dashboard" | "automation";
          parentResourceId: string;
        };
      };
      responses: {
        /** @description Returns data about user last visit map. */
        200: {
          content: {
            "application/json": {
              [key: string]: {
                /** @enum {string} */
                resourceType: "base" | "table" | "view" | "dashboard" | "automation";
                resourceId: string;
                childResourceId?: string;
              };
            };
          };
        };
      };
    };
  };
  "/user/last-visit/list-base": {
    get: {
      responses: {
        /** @description Returns data about user last visit base. */
        200: {
          content: {
            "application/json": {
              total: number;
              list: ({
                  /** @enum {string} */
                  resourceType: "base" | "table" | "view" | "dashboard" | "automation";
                  resourceId: string;
                  resource: {
                    id: string;
                    name: string;
                    spaceId: string;
                    icon: string | null;
                    /** @enum {string} */
                    role: "owner" | "creator" | "editor" | "commenter" | "viewer";
                    restrictedAuthority?: boolean;
                  };
                  lastVisitTime?: string;
                })[];
            };
          };
        };
      };
    };
  };
  "/auth/user/me": {
    /** @description Get user information */
    get: {
      responses: {
        /** @description Successfully retrieved user information */
        200: {
          content: {
            "application/json": {
              id: string;
              name: string;
              avatar?: string | null;
              /** Format: email */
              email: string;
              phone?: string | null;
              notifyMeta: {
                email?: boolean;
              };
              hasPassword: boolean;
              isAdmin?: boolean | null;
              organization?: {
                id: string;
                name: string;
                departments: {
                    id: string;
                    name: string;
                  }[];
                isAdmin?: boolean;
              };
            };
          };
        };
      };
    };
  };
  "/auth/signin": {
    /** @description Sign in */
    post: {
      requestBody?: {
        content: {
          "application/json": {
            /** Format: email */
            email: string;
            /** @description Minimum 8 chars */
            password: string;
            turnstileToken?: string;
          };
        };
      };
      responses: {
        /** @description Sign in successfully */
        201: {
          content: {
            "application/json": {
              id: string;
              name: string;
              avatar?: string | null;
              /** Format: email */
              email: string;
              phone?: string | null;
              notifyMeta: {
                email?: boolean;
              };
              hasPassword: boolean;
              isAdmin?: boolean | null;
              organization?: {
                id: string;
                name: string;
                departments: {
                    id: string;
                    name: string;
                  }[];
                isAdmin?: boolean;
              };
            };
          };
        };
      };
    };
  };
  "/auth/signout": {
    /** @description Sign out */
    post: {
      responses: {
        /** @description Sign out successfully */
        201: {
          content: never;
        };
      };
    };
  };
  "/auth/signup": {
    /** @description Sign up */
    post: {
      requestBody?: {
        content: {
          "application/json": {
            /** Format: email */
            email: string;
            /** @description Minimum 8 chars */
            password: string;
            turnstileToken?: string;
            defaultSpaceName?: string;
            refMeta?: {
              query?: string;
              referer?: string;
            };
            verification?: {
              code: string;
              token: string;
            };
            inviteCode?: string;
          };
        };
      };
      responses: {
        /** @description Sign up and sing in successfully */
        201: {
          content: {
            "application/json": {
              id: string;
              name: string;
              avatar?: string | null;
              /** Format: email */
              email: string;
              phone?: string | null;
              notifyMeta: {
                email?: boolean;
              };
              hasPassword: boolean;
              isAdmin?: boolean | null;
              organization?: {
                id: string;
                name: string;
                departments: {
                    id: string;
                    name: string;
                  }[];
                isAdmin?: boolean;
              };
            };
          };
        };
      };
    };
  };
  "/auth/change-password": {
    /** @description Change password */
    patch: {
      requestBody?: {
        content: {
          "application/json": {
            /** @description Minimum 8 chars */
            password: string;
            /** @description Minimum 8 chars */
            newPassword: string;
          };
        };
      };
      responses: {
        /** @description Change password successfully */
        201: {
          content: never;
        };
      };
    };
  };
  "/auth/send-reset-password-email": {
    /** @description Send reset password email */
    post: {
      requestBody?: {
        content: {
          "application/json": {
            /** Format: email */
            email: string;
          };
        };
      };
      responses: {
        /** @description Successfully sent reset password email */
        201: {
          content: never;
        };
      };
    };
  };
  "/auth/reset-password": {
    /** @description Reset password */
    post: {
      requestBody?: {
        content: {
          "application/json": {
            /** @description Minimum 8 chars */
            password: string;
            code: string;
          };
        };
      };
      responses: {
        /** @description Successfully reset password */
        201: {
          content: never;
        };
      };
    };
  };
  "/auth/add-password": {
    /** @description Add password */
    post: {
      requestBody?: {
        content: {
          "application/json": {
            /** @description Minimum 8 chars */
            password: string;
          };
        };
      };
      responses: {
        /** @description Successfully added password */
        201: {
          content: never;
        };
      };
    };
  };
  "/auth/user": {
    /** @description Get user information via access token */
    get: {
      responses: {
        /** @description Successfully retrieved user information */
        200: {
          content: {
            "application/json": {
              id: string;
              name: string;
              avatar?: string | null;
              /** Format: email */
              email?: string;
              primaryDepartmentId?: string | null;
              primaryDepartmentName?: string | null;
              primaryDepartmentCode?: string | null;
            };
          };
        };
      };
    };
    /** @description Delete user */
    delete: {
      parameters: {
        path: {
          /** @description Please enter DELETE to confirm */
          confirm: string;
        };
      };
      responses: {
        /** @description Successfully deleted user */
        200: {
          content: never;
        };
        /** @description User has deleted bases or spaces */
        400: {
          content: {
            "application/json": {
              spaces: ({
                  id: string;
                  name: string;
                  deletedTime: string | null;
                })[];
            };
          };
        };
      };
    };
  };
  "/auth/send-signup-verification-code": {
    /** @description Send signup verification code */
    post: {
      requestBody?: {
        content: {
          "application/json": {
            /** Format: email */
            email: string;
            turnstileToken?: string;
          };
        };
      };
      responses: {
        /** @description Resend signup verification code successfully */
        200: {
          content: {
            "application/json": {
              token: string;
              expiresTime: string;
            };
          };
        };
      };
    };
  };
  "/auth/change-email": {
    /** @description Change email */
    patch: {
      requestBody?: {
        content: {
          "application/json": {
            /** Format: email */
            email: string;
            token: string;
            code: string;
          };
        };
      };
      responses: {
        /** @description Change email successfully */
        200: {
          content: never;
        };
      };
    };
  };
  "/auth/send-change-email-code": {
    /** @description Send change email code */
    post: {
      requestBody?: {
        content: {
          "application/json": {
            /** Format: email */
            email: string;
            password: string;
          };
        };
      };
      responses: {
        /** @description Send change email code successfully */
        200: {
          content: {
            "application/json": {
              token: string;
            };
          };
        };
      };
    };
  };
  "/auth/temp-token": {
    /** @description Get temp token */
    get: {
      responses: {
        /** @description Get temp token successfully */
        200: {
          content: {
            "application/json": {
              accessToken: string;
              expiresTime: string;
            };
          };
        };
      };
    };
  };
  "/auth/invite-waitlist": {
    /** @description Invite waitlist */
    post: {
      requestBody?: {
        content: {
          "application/json": {
            list: string[];
          };
        };
      };
      responses: {
        /** @description Invite waitlist successfully */
        201: {
          content: {
            "application/json": {
                /** Format: email */
                email: string;
                code: string;
                times: number;
              }[];
          };
        };
      };
    };
  };
  "/auth/waitlist-invite-code": {
    /** @description Gen waitlist invite code */
    post: {
      requestBody?: {
        content: {
          "application/json": {
            /**
             * @description The number of invite codes to generate
             * @example 10
             */
            count: number;
            /**
             * @description The number of invite codes to use
             * @example 10
             */
            times: number;
          };
        };
      };
      responses: {
        /** @description Gen waitlist invite code successfully */
        201: {
          content: {
            "application/json": {
                code: string;
                times: number;
              }[];
          };
        };
      };
    };
  };
  "/auth/join-waitlist": {
    /** @description Join waitlist */
    post: {
      requestBody?: {
        content: {
          "application/json": {
            /** Format: email */
            email: string;
          };
        };
      };
      responses: {
        /** @description Join waitlist successfully */
        200: {
          content: {
            "application/json": {
              /** Format: email */
              email: string;
            };
          };
        };
      };
    };
  };
  "/auth/waitlist": {
    /** @description Get waitlist */
    get: {
      responses: {
        /** @description Get waitlist successfully */
        200: {
          content: {
            "application/json": ({
                /** Format: email */
                email: string;
                invite: boolean | null;
                inviteTime: string | null;
                createdTime: string;
              })[];
          };
        };
      };
    };
  };
  "/base/{baseId}/connection": {
    /** @description Get db connection info */
    get: {
      parameters: {
        path: {
          baseId: string;
        };
      };
      responses: {
        /** @description Returns information about a db connection. */
        200: {
          content: {
            "application/json": {
              dsn: {
                driver: string;
                host: string;
                port?: number;
                db?: string;
                user?: string;
                pass?: string;
                params?: {
                  [key: string]: string | number | boolean;
                };
              };
              connection: {
                max: number;
                current: number;
              };
              /** @description The URL that can be used to connect to the database */
              url: string;
            };
          };
        };
      };
    };
    /** @description Create a db connection url */
    post: {
      requestBody?: {
        content: {
          "application/json": {
            baseId: string;
          };
        };
      };
      responses: {
        /** @description Connection created successfully */
        201: {
          content: {
            "application/json": ({
              dsn: {
                driver: string;
                host: string;
                port?: number;
                db?: string;
                user?: string;
                pass?: string;
                params?: {
                  [key: string]: string | number | boolean;
                };
              };
              connection: {
                max: number;
                current: number;
              };
              /** @description The URL that can be used to connect to the database */
              url: string;
            }) | null;
          };
        };
      };
    };
    /** @description Delete a db connection */
    delete: {
      parameters: {
        path: {
          baseId: string;
        };
      };
      responses: {
        /** @description Deleted successfully */
        200: {
          content: never;
        };
      };
    };
  };
  "/invitation/link/accept": {
    /** @description Accept invitation link */
    post: {
      requestBody?: {
        content: {
          "application/json": {
            invitationCode: string;
            invitationId: string;
          };
        };
      };
      responses: {
        /** @description Successful response, return the spaceId or baseId of the invitation link. */
        201: {
          content: {
            "application/json": {
              spaceId: string | null;
              baseId: string | null;
            };
          };
        };
      };
    };
  };
  "/share/{shareId}/view/auth": {
    /** @description share view auth password */
    post: {
      parameters: {
        path: {
          shareId: string;
        };
      };
      requestBody?: {
        content: {
          "application/json": {
            password: string;
          };
        };
      };
      responses: {
        /** @description Successfully authenticated */
        201: {
          content: {
            "application/json": {
              token: string;
            };
          };
        };
      };
    };
  };
  "/share/{shareId}/view": {
    /** @description get share view info */
    get: {
      parameters: {
        path: {
          shareId: string;
        };
      };
      responses: {
        /** @description share view info */
        200: {
          content: {
            "application/json": {
              viewId?: string;
              tableId: string;
              shareId: string;
              shareMeta?: {
                allowCopy?: boolean;
                includeHiddenField?: boolean;
                password?: string;
                includeRecords?: boolean;
                submit?: {
                  allow?: boolean;
                  requireLogin?: boolean;
                };
              };
              view?: {
                id: string;
                name: string;
                /** @enum {string} */
                type: "grid" | "calendar" | "kanban" | "form" | "gallery" | "plugin";
                description?: string;
                order?: number;
                options?: ({
                  /**
                   * @description The row height level of row in view
                   * @enum {string}
                   */
                  rowHeight?: "short" | "medium" | "tall" | "extraTall" | "autoFit";
                  /** @description The field name display lines in view */
                  fieldNameDisplayLines?: number;
                  /** @description The frozen column count in view */
                  frozenColumnCount?: number;
                }) | ({
                  /** @description The field id of the Kanban stack. */
                  stackFieldId?: string;
                  /** @description The cover field id is a designated attachment field id, the contents of which appear at the top of each Kanban card. */
                  coverFieldId?: string | null;
                  /** @description If true, cover images are resized to fit Kanban cards. */
                  isCoverFit?: boolean;
                  /** @description If true, hides field name in the Kanban cards. */
                  isFieldNameHidden?: boolean;
                  /** @description If true, hides empty stacks in the Kanban. */
                  isEmptyStackHidden?: boolean;
                }) | ({
                  /** @description The cover field id is a designated attachment field id, the contents of which appear at the top of each gallery card. */
                  coverFieldId?: string | null;
                  /** @description If true, cover images are resized to fit gallery cards. */
                  isCoverFit?: boolean;
                  /** @description If true, hides field name in the gallery cards. */
                  isFieldNameHidden?: boolean;
                }) | ({
                  /** @description The start date field id. */
                  startDateFieldId?: string | null;
                  /** @description The end date field id. */
                  endDateFieldId?: string | null;
                  /** @description The title field id. */
                  titleFieldId?: string | null;
                  colorConfig?: ({
                    /** @enum {string} */
                    type: "field" | "custom";
                    /** @description The color field id. */
                    fieldId?: string | null;
                    /**
                     * @description The color.
                     * @enum {string|null}
                     */
                    color?: "blueLight2" | "blueLight1" | "blueBright" | "blue" | "blueDark1" | "cyanLight2" | "cyanLight1" | "cyanBright" | "cyan" | "cyanDark1" | "grayLight2" | "grayLight1" | "grayBright" | "gray" | "grayDark1" | "greenLight2" | "greenLight1" | "greenBright" | "green" | "greenDark1" | "orangeLight2" | "orangeLight1" | "orangeBright" | "orange" | "orangeDark1" | "pinkLight2" | "pinkLight1" | "pinkBright" | "pink" | "pinkDark1" | "purpleLight2" | "purpleLight1" | "purpleBright" | "purple" | "purpleDark1" | "redLight2" | "redLight1" | "redBright" | "red" | "redDark1" | "tealLight2" | "tealLight1" | "tealBright" | "teal" | "tealDark1" | "yellowLight2" | "yellowLight1" | "yellowBright" | "yellow" | "yellowDark1" | null;
                  }) | null;
                }) | {
                  /** @description The cover url of the form */
                  coverUrl?: string;
                  /** @description The logo url of the form */
                  logoUrl?: string;
                  /** @description The submit button text of the form */
                  submitLabel?: string;
                } | {
                  /** @description The plugin id */
                  pluginId: string;
                  /** @description The plugin install id */
                  pluginInstallId: string;
                  /** @description The plugin logo */
                  pluginLogo: string;
                };
                sort?: ({
                  sortObjs: ({
                      /** @description The id of the field. */
                      fieldId: string;
                      /** @enum {string} */
                      order: "asc" | "desc";
                    })[];
                  manualSort?: boolean;
                }) | null;
                /** @description A filter object for complex query conditions based on fields, operators, and values. Use our visual query builder at https://app.teable.ai/developer/tool/query-builder to build filters. */
                filter?: Record<string, never>;
                group?: (({
                    /** @description The id of the field. */
                    fieldId: string;
                    /** @enum {string} */
                    order: "asc" | "desc";
                  })[]) | null;
                isLocked?: boolean;
                shareId?: string;
                enableShare?: boolean;
                shareMeta?: {
                  allowCopy?: boolean;
                  includeHiddenField?: boolean;
                  password?: string;
                  includeRecords?: boolean;
                  submit?: {
                    allow?: boolean;
                    requireLogin?: boolean;
                  };
                };
                createdBy: string;
                lastModifiedBy?: string;
                createdTime: string;
                lastModifiedTime?: string;
                /** @description A mapping of view IDs to their corresponding column metadata. */
                columnMeta: {
                  [key: string]: ({
                    /** @description Order is a floating number, column will sort by it in the view. */
                    order: number;
                    /** @description Column width in the view. */
                    width?: number;
                    /** @description If column hidden in the view. */
                    hidden?: boolean;
                    /**
                     * @description Statistic function of the column in the view.
                     * @enum {string|null}
                     */
                    statisticFunc?: "count" | "empty" | "filled" | "unique" | "max" | "min" | "sum" | "average" | "checked" | "unChecked" | "percentEmpty" | "percentFilled" | "percentUnique" | "percentChecked" | "percentUnChecked" | "earliestDate" | "latestDate" | "dateRangeOfDays" | "dateRangeOfMonths" | "totalAttachmentSize" | null;
                  }) | {
                    /** @description Order is a floating number, column will sort by it in the view. */
                    order: number;
                    /** @description If column visible in the kanban view. */
                    visible?: boolean;
                  } | {
                    /** @description Order is a floating number, column will sort by it in the view. */
                    order: number;
                    /** @description If column visible in the gallery view. */
                    visible?: boolean;
                  } | {
                    /** @description Order is a floating number, column will sort by it in the view. */
                    order: number;
                    /** @description If column visible in the view. */
                    visible?: boolean;
                    /** @description If column is required. */
                    required?: boolean;
                  } | {
                    /** @description Order is a floating number, column will sort by it in the view. */
                    order: number;
                    /** @description If column hidden in the view. */
                    hidden?: boolean;
                  };
                };
                pluginId?: string;
              };
              fields: ({
                  /** @description The id of the field. */
                  id: string;
                  /**
                   * @description The name of the field. can not be duplicated in the table.
                   * @example Tags
                   */
                  name: string;
                  /**
                   * @description The field types supported by teable.
                   * @example singleSelect
                   * @enum {string}
                   */
                  type: "singleLineText" | "longText" | "user" | "attachment" | "checkbox" | "multipleSelect" | "singleSelect" | "date" | "number" | "rating" | "formula" | "rollup" | "link" | "createdTime" | "lastModifiedTime" | "createdBy" | "lastModifiedBy" | "autoNumber" | "button" | "department" | "createdByDepartment" | "lastModifiedByDepartment";
                  /**
                   * @description The description of the field.
                   * @example this is a summary
                   */
                  description?: string;
                  /** @description The configuration options of the field. The structure of the field's options depend on the field's type. */
                  options: ({
                    /** @enum {string} */
                    expression: "countall({values})" | "counta({values})" | "count({values})" | "sum({values})" | "max({values})" | "min({values})" | "and({values})" | "or({values})" | "xor({values})" | "array_join({values})" | "array_unique({values})" | "array_compact({values})" | "concatenate({values})";
                    /** @description The time zone that should be used to format dates */
                    timeZone?: string;
                    /** @description Different cell value types are determined based on the results of expression parsing, where numbers, dates, and formatting options are provided */
                    formatting?: ({
                      /** @description the display formatting of the date. you can use the following presets: M/D/YYYY, D/M/YYYY, YYYY/MM/DD, YYYY-MM-DD, YYYY-MM, MM-DD, YYYY, MM, DD */
                      date: string;
                      /**
                       * @description the display formatting of the time. you can use the following presets: HH:mm, hh:mm A, None
                       * @enum {string}
                       */
                      time: "HH:mm" | "hh:mm A" | "None";
                      /** @description The time zone that should be used to format dates */
                      timeZone: string;
                    }) | {
                      precision: number;
                      /** @enum {string} */
                      type: "decimal";
                    } | {
                      precision: number;
                      /** @enum {string} */
                      type: "percent";
                    } | {
                      precision: number;
                      /** @enum {string} */
                      type: "currency";
                      symbol: string;
                    };
                    /** @description According to the results of expression parsing to determine different visual effects, where strings, numbers will provide customized "show as" */
                    showAs?: ({
                      /**
                       * @description can display as url, email or phone in string field with a button to perform the corresponding action, start a phone call, send an email, or open a link in a new tab
                       * @enum {string}
                       */
                      type: "url" | "email" | "phone";
                    }) | ({
                      /**
                       * @description can display as bar or ring in number field with single cellValue value
                       * @enum {string}
                       */
                      type: "bar" | "ring";
                      /** @enum {string} */
                      color: "blueLight2" | "blueLight1" | "blueBright" | "blue" | "blueDark1" | "cyanLight2" | "cyanLight1" | "cyanBright" | "cyan" | "cyanDark1" | "grayLight2" | "grayLight1" | "grayBright" | "gray" | "grayDark1" | "greenLight2" | "greenLight1" | "greenBright" | "green" | "greenDark1" | "orangeLight2" | "orangeLight1" | "orangeBright" | "orange" | "orangeDark1" | "pinkLight2" | "pinkLight1" | "pinkBright" | "pink" | "pinkDark1" | "purpleLight2" | "purpleLight1" | "purpleBright" | "purple" | "purpleDark1" | "redLight2" | "redLight1" | "redBright" | "red" | "redDark1" | "tealLight2" | "tealLight1" | "tealBright" | "teal" | "tealDark1" | "yellowLight2" | "yellowLight1" | "yellowBright" | "yellow" | "yellowDark1";
                      /** @description whether to displays the specific value on the graph */
                      showValue: boolean;
                      /** @description the value that represents a 100% maximum value, it does not represent a hard limit on the value */
                      maxValue: number;
                    }) | ({
                      /**
                       * @description can display as bar or line in number field with multiple cellValue value
                       * @enum {string}
                       */
                      type: "bar" | "line";
                      /** @enum {string} */
                      color: "blueLight2" | "blueLight1" | "blueBright" | "blue" | "blueDark1" | "cyanLight2" | "cyanLight1" | "cyanBright" | "cyan" | "cyanDark1" | "grayLight2" | "grayLight1" | "grayBright" | "gray" | "grayDark1" | "greenLight2" | "greenLight1" | "greenBright" | "green" | "greenDark1" | "orangeLight2" | "orangeLight1" | "orangeBright" | "orange" | "orangeDark1" | "pinkLight2" | "pinkLight1" | "pinkBright" | "pink" | "pinkDark1" | "purpleLight2" | "purpleLight1" | "purpleBright" | "purple" | "purpleDark1" | "redLight2" | "redLight1" | "redBright" | "red" | "redDark1" | "tealLight2" | "tealLight1" | "tealBright" | "teal" | "tealDark1" | "yellowLight2" | "yellowLight1" | "yellowBright" | "yellow" | "yellowDark1";
                    });
                  }) | ({
                    /** @description The formula including fields referenced by their IDs. For example, LEFT(4, {Birthday}) input will be returned as LEFT(4, {fldXXX}) via API. The formula syntax in Teable is basically the same as Airtable */
                    expression: string;
                    /** @description The time zone that should be used to format dates */
                    timeZone?: string;
                    /** @description Different cell value types are determined based on the results of expression parsing, where numbers, dates, and formatting options are provided */
                    formatting?: ({
                      /** @description the display formatting of the date. you can use the following presets: M/D/YYYY, D/M/YYYY, YYYY/MM/DD, YYYY-MM-DD, YYYY-MM, MM-DD, YYYY, MM, DD */
                      date: string;
                      /**
                       * @description the display formatting of the time. you can use the following presets: HH:mm, hh:mm A, None
                       * @enum {string}
                       */
                      time: "HH:mm" | "hh:mm A" | "None";
                      /** @description The time zone that should be used to format dates */
                      timeZone: string;
                    }) | {
                      precision: number;
                      /** @enum {string} */
                      type: "decimal";
                    } | {
                      precision: number;
                      /** @enum {string} */
                      type: "percent";
                    } | {
                      precision: number;
                      /** @enum {string} */
                      type: "currency";
                      symbol: string;
                    };
                    /** @description According to the results of expression parsing to determine different visual effects, where strings, numbers will provide customized "show as" */
                    showAs?: ({
                      /**
                       * @description can display as url, email or phone in string field with a button to perform the corresponding action, start a phone call, send an email, or open a link in a new tab
                       * @enum {string}
                       */
                      type: "url" | "email" | "phone";
                    }) | ({
                      /**
                       * @description can display as bar or ring in number field with single cellValue value
                       * @enum {string}
                       */
                      type: "bar" | "ring";
                      /** @enum {string} */
                      color: "blueLight2" | "blueLight1" | "blueBright" | "blue" | "blueDark1" | "cyanLight2" | "cyanLight1" | "cyanBright" | "cyan" | "cyanDark1" | "grayLight2" | "grayLight1" | "grayBright" | "gray" | "grayDark1" | "greenLight2" | "greenLight1" | "greenBright" | "green" | "greenDark1" | "orangeLight2" | "orangeLight1" | "orangeBright" | "orange" | "orangeDark1" | "pinkLight2" | "pinkLight1" | "pinkBright" | "pink" | "pinkDark1" | "purpleLight2" | "purpleLight1" | "purpleBright" | "purple" | "purpleDark1" | "redLight2" | "redLight1" | "redBright" | "red" | "redDark1" | "tealLight2" | "tealLight1" | "tealBright" | "teal" | "tealDark1" | "yellowLight2" | "yellowLight1" | "yellowBright" | "yellow" | "yellowDark1";
                      /** @description whether to displays the specific value on the graph */
                      showValue: boolean;
                      /** @description the value that represents a 100% maximum value, it does not represent a hard limit on the value */
                      maxValue: number;
                    }) | ({
                      /**
                       * @description can display as bar or line in number field with multiple cellValue value
                       * @enum {string}
                       */
                      type: "bar" | "line";
                      /** @enum {string} */
                      color: "blueLight2" | "blueLight1" | "blueBright" | "blue" | "blueDark1" | "cyanLight2" | "cyanLight1" | "cyanBright" | "cyan" | "cyanDark1" | "grayLight2" | "grayLight1" | "grayBright" | "gray" | "grayDark1" | "greenLight2" | "greenLight1" | "greenBright" | "green" | "greenDark1" | "orangeLight2" | "orangeLight1" | "orangeBright" | "orange" | "orangeDark1" | "pinkLight2" | "pinkLight1" | "pinkBright" | "pink" | "pinkDark1" | "purpleLight2" | "purpleLight1" | "purpleBright" | "purple" | "purpleDark1" | "redLight2" | "redLight1" | "redBright" | "red" | "redDark1" | "tealLight2" | "tealLight1" | "tealBright" | "teal" | "tealDark1" | "yellowLight2" | "yellowLight1" | "yellowBright" | "yellow" | "yellowDark1";
                    });
                  }) | ({
                    /** @description the base id of the table that this field is linked to, only required for cross base link */
                    baseId?: string;
                    /**
                     * @description describe the relationship from this table to the foreign table
                     * @enum {string}
                     */
                    relationship: "oneOne" | "manyMany" | "oneMany" | "manyOne";
                    /** @description the table this field is linked to */
                    foreignTableId: string;
                    /** @description the field in the foreign table that will be displayed as the current field */
                    lookupFieldId: string;
                    /** @description whether the field is a one-way link, when true, it will not generate a symmetric field, it is generally has better performance */
                    isOneWay?: boolean;
                    /** @description the table name for storing keys, in many-to-many relationships, keys are stored in a separate intermediate table; in other relationships, keys are stored on one side as needed */
                    fkHostTableName: string;
                    /** @description the name of the field that stores the current table primary key */
                    selfKeyName: string;
                    /** @description The name of the field that stores the foreign table primary key */
                    foreignKeyName: string;
                    /** @description the symmetric field in the foreign table, empty if the field is a one-way link */
                    symmetricFieldId?: string;
                    /** @description the view id that limits the number of records in the link field */
                    filterByViewId?: string | null;
                    /** @description the fields that will be displayed in the link field */
                    visibleFieldIds?: string[] | null;
                    /** @description A filter object for complex query conditions based on fields, operators, and values. Use our visual query builder at https://app.teable.ai/developer/tool/query-builder to build filters. */
                    filter?: Record<string, never>;
                  }) | ({
                    /** @description caveat: the formatting is just a formatter, it dose not effect the storing value of the record */
                    formatting: {
                      /** @description the display formatting of the date. you can use the following presets: M/D/YYYY, D/M/YYYY, YYYY/MM/DD, YYYY-MM-DD, YYYY-MM, MM-DD, YYYY, MM, DD */
                      date: string;
                      /**
                       * @description the display formatting of the time. you can use the following presets: HH:mm, hh:mm A, None
                       * @enum {string}
                       */
                      time: "HH:mm" | "hh:mm A" | "None";
                      /** @description The time zone that should be used to format dates */
                      timeZone: string;
                    };
                    /**
                     * @description Whether the new row is automatically filled with the current time, caveat: the defaultValue is just a flag, it dose not effect the storing value of the record
                     * @enum {string}
                     */
                    defaultValue?: "now";
                  }) | {
                    defaultValue?: boolean;
                  } | Record<string, never> | ({
                    /** @description Only be used in single line text field or formula / rollup field with cellValueType equals String and isMultipleCellValue is not true */
                    showAs?: {
                      /**
                       * @description can display as url, email or phone in string field with a button to perform the corresponding action, start a phone call, send an email, or open a link in a new tab
                       * @enum {string}
                       */
                      type: "url" | "email" | "phone";
                    };
                    defaultValue?: string;
                  }) | ({
                    /** @enum {string} */
                    icon: "star" | "moon" | "sun" | "zap" | "flame" | "heart" | "apple" | "thumb-up";
                    /** @enum {string} */
                    color: "yellowBright" | "redBright" | "tealBright";
                    max: number;
                  }) | ({
                    /** @description Allow adding multiple users */
                    isMultiple?: boolean;
                    /** @description Notify users when their name is added to a cell */
                    shouldNotify?: boolean;
                    defaultValue?: string | "me" | ((string | "me")[]);
                  }) | ({
                    /** @description Button label */
                    label: string;
                    /**
                     * @description Button color
                     * @enum {string}
                     */
                    color: "blueLight2" | "blueLight1" | "blueBright" | "blue" | "blueDark1" | "cyanLight2" | "cyanLight1" | "cyanBright" | "cyan" | "cyanDark1" | "grayLight2" | "grayLight1" | "grayBright" | "gray" | "grayDark1" | "greenLight2" | "greenLight1" | "greenBright" | "green" | "greenDark1" | "orangeLight2" | "orangeLight1" | "orangeBright" | "orange" | "orangeDark1" | "pinkLight2" | "pinkLight1" | "pinkBright" | "pink" | "pinkDark1" | "purpleLight2" | "purpleLight1" | "purpleBright" | "purple" | "purpleDark1" | "redLight2" | "redLight1" | "redBright" | "red" | "redDark1" | "tealLight2" | "tealLight1" | "tealBright" | "teal" | "tealDark1" | "yellowLight2" | "yellowLight1" | "yellowBright" | "yellow" | "yellowDark1";
                    /** @description Max count of button clicks */
                    maxCount?: number;
                    /** @description Reset count */
                    resetCount?: boolean;
                    /** @description Workflow */
                    workflow?: {
                      /** @description Workflow ID */
                      id?: string;
                      /** @description Workflow Name */
                      name?: string;
                      /** @description Workflow is active */
                      isActive?: boolean;
                    } | null;
                  }) | ({
                    choices: ({
                        id: string;
                        name: string;
                        /** @enum {string} */
                        color: "blueLight2" | "blueLight1" | "blueBright" | "blue" | "blueDark1" | "cyanLight2" | "cyanLight1" | "cyanBright" | "cyan" | "cyanDark1" | "grayLight2" | "grayLight1" | "grayBright" | "gray" | "grayDark1" | "greenLight2" | "greenLight1" | "greenBright" | "green" | "greenDark1" | "orangeLight2" | "orangeLight1" | "orangeBright" | "orange" | "orangeDark1" | "pinkLight2" | "pinkLight1" | "pinkBright" | "pink" | "pinkDark1" | "purpleLight2" | "purpleLight1" | "purpleBright" | "purple" | "purpleDark1" | "redLight2" | "redLight1" | "redBright" | "red" | "redDark1" | "tealLight2" | "tealLight1" | "tealBright" | "teal" | "tealDark1" | "yellowLight2" | "yellowLight1" | "yellowBright" | "yellow" | "yellowDark1";
                      })[];
                    defaultValue?: string | string[];
                    preventAutoNewOptions?: boolean;
                  }) | ({
                    /** @description Only be used in number field (number field or formula / rollup field with cellValueType equals Number */
                    formatting: {
                      precision: number;
                      /** @enum {string} */
                      type: "decimal";
                    } | {
                      precision: number;
                      /** @enum {string} */
                      type: "percent";
                    } | {
                      precision: number;
                      /** @enum {string} */
                      type: "currency";
                      symbol: string;
                    };
                    /** @description Only be used in number field (number field or formula / rollup field with cellValueType equals Number */
                    showAs?: ({
                      /**
                       * @description can display as bar or ring in number field with single cellValue value
                       * @enum {string}
                       */
                      type: "bar" | "ring";
                      /** @enum {string} */
                      color: "blueLight2" | "blueLight1" | "blueBright" | "blue" | "blueDark1" | "cyanLight2" | "cyanLight1" | "cyanBright" | "cyan" | "cyanDark1" | "grayLight2" | "grayLight1" | "grayBright" | "gray" | "grayDark1" | "greenLight2" | "greenLight1" | "greenBright" | "green" | "greenDark1" | "orangeLight2" | "orangeLight1" | "orangeBright" | "orange" | "orangeDark1" | "pinkLight2" | "pinkLight1" | "pinkBright" | "pink" | "pinkDark1" | "purpleLight2" | "purpleLight1" | "purpleBright" | "purple" | "purpleDark1" | "redLight2" | "redLight1" | "redBright" | "red" | "redDark1" | "tealLight2" | "tealLight1" | "tealBright" | "teal" | "tealDark1" | "yellowLight2" | "yellowLight1" | "yellowBright" | "yellow" | "yellowDark1";
                      /** @description whether to displays the specific value on the graph */
                      showValue: boolean;
                      /** @description the value that represents a 100% maximum value, it does not represent a hard limit on the value */
                      maxValue: number;
                    }) | ({
                      /**
                       * @description can display as bar or line in number field with multiple cellValue value
                       * @enum {string}
                       */
                      type: "bar" | "line";
                      /** @enum {string} */
                      color: "blueLight2" | "blueLight1" | "blueBright" | "blue" | "blueDark1" | "cyanLight2" | "cyanLight1" | "cyanBright" | "cyan" | "cyanDark1" | "grayLight2" | "grayLight1" | "grayBright" | "gray" | "grayDark1" | "greenLight2" | "greenLight1" | "greenBright" | "green" | "greenDark1" | "orangeLight2" | "orangeLight1" | "orangeBright" | "orange" | "orangeDark1" | "pinkLight2" | "pinkLight1" | "pinkBright" | "pink" | "pinkDark1" | "purpleLight2" | "purpleLight1" | "purpleBright" | "purple" | "purpleDark1" | "redLight2" | "redLight1" | "redBright" | "red" | "redDark1" | "tealLight2" | "tealLight1" | "tealBright" | "teal" | "tealDark1" | "yellowLight2" | "yellowLight1" | "yellowBright" | "yellow" | "yellowDark1";
                    });
                    defaultValue?: number;
                  }) | {
                    /** @enum {string} */
                    expression: "AUTO_NUMBER()";
                  } | ({
                    /** @enum {string} */
                    expression: "CREATED_TIME()";
                    /** @description caveat: the formatting is just a formatter, it dose not effect the storing value of the record */
                    formatting: {
                      /** @description the display formatting of the date. you can use the following presets: M/D/YYYY, D/M/YYYY, YYYY/MM/DD, YYYY-MM-DD, YYYY-MM, MM-DD, YYYY, MM, DD */
                      date: string;
                      /**
                       * @description the display formatting of the time. you can use the following presets: HH:mm, hh:mm A, None
                       * @enum {string}
                       */
                      time: "HH:mm" | "hh:mm A" | "None";
                      /** @description The time zone that should be used to format dates */
                      timeZone: string;
                    };
                  }) | ({
                    /** @enum {string} */
                    expression: "LAST_MODIFIED_TIME()";
                    /** @description caveat: the formatting is just a formatter, it dose not effect the storing value of the record */
                    formatting: {
                      /** @description the display formatting of the date. you can use the following presets: M/D/YYYY, D/M/YYYY, YYYY/MM/DD, YYYY-MM-DD, YYYY-MM, MM-DD, YYYY, MM, DD */
                      date: string;
                      /**
                       * @description the display formatting of the time. you can use the following presets: HH:mm, hh:mm A, None
                       * @enum {string}
                       */
                      time: "HH:mm" | "hh:mm A" | "None";
                      /** @description The time zone that should be used to format dates */
                      timeZone: string;
                    };
                  });
                  /** @description The AI configuration of the field. */
                  aiConfig?: unknown;
                  /** @description Whether this field is lookup field. witch means cellValue and [fieldType] is looked up from the linked table. */
                  isLookup?: boolean;
                  /** @description field lookup options. */
                  lookupOptions?: {
                    /** @description the table this field is linked to */
                    foreignTableId: string;
                    /** @description the field in the foreign table that will be displayed as the current field */
                    lookupFieldId: string;
                    /**
                     * @description describe the relationship from this table to the foreign table
                     * @enum {string}
                     */
                    relationship: "oneOne" | "manyMany" | "oneMany" | "manyOne";
                    /** @description the table name for storing keys, in many-to-many relationships, keys are stored in a separate intermediate table; in other relationships, keys are stored on one side as needed */
                    fkHostTableName: string;
                    /** @description the name of the field that stores the current table primary key */
                    selfKeyName: string;
                    /** @description The name of the field that stores the foreign table primary key */
                    foreignKeyName: string;
                    /** @description A filter object for complex query conditions based on fields, operators, and values. Use our visual query builder at https://app.teable.ai/developer/tool/query-builder to build filters. */
                    filter?: Record<string, never>;
                    /** @description The id of Linked record field to use for lookup */
                    linkFieldId: string;
                  };
                  /** @description Whether this field is not null. */
                  notNull?: boolean;
                  /** @description Whether this field is not unique. */
                  unique?: boolean;
                  /** @description Whether this field is primary field. */
                  isPrimary?: boolean;
                  /** @description Whether this field is computed field, you can not modify cellValue in computed field. */
                  isComputed?: boolean;
                  /** @description Whether this field's calculation is pending. */
                  isPending?: boolean;
                  /** @description Whether This field has a configuration error. Check the fields referenced by this field's formula or configuration. */
                  hasError?: boolean;
                  /**
                   * @description The cell value type of the field.
                   * @enum {string}
                   */
                  cellValueType: "string" | "number" | "boolean" | "dateTime";
                  /** @description Whether this field has multiple cell value. */
                  isMultipleCellValue?: boolean;
                  /**
                   * @description The field type of database that cellValue really store.
                   * @enum {string}
                   */
                  dbFieldType: "TEXT" | "INTEGER" | "DATETIME" | "REAL" | "BLOB" | "JSON" | "BOOLEAN";
                  /** @description Field(column) name in backend database. Limitation: 1-63 characters, can only contain letters, numbers and underscore, case sensitive, cannot be duplicated with existing db field name in the table. */
                  dbFieldName: string;
                  /** @description Field record read permission. When set to false, reading records is denied. When true or not set, reading records is allowed. */
                  recordRead?: boolean;
                  /** @description Field record create permission. When set to false, creating records is denied. When true or not set, creating records is allowed. */
                  recordCreate?: boolean;
                })[];
              /** @description first 50 records */
              records: {
                  /** @description The record id. */
                  id: string;
                  /** @description primary field value */
                  name?: string;
                  /** @description Objects with a fields key mapping fieldId or field name to value for that field. */
                  fields: {
                    [key: string]: unknown;
                  };
                  /** @description Auto number, a unique identifier for each record */
                  autoNumber?: number;
                  /** @description Created time, date ISO string (new Date().toISOString). */
                  createdTime?: string;
                  /** @description Last modified time, date ISO string (new Date().toISOString). */
                  lastModifiedTime?: string;
                  /** @description Created by, user name */
                  createdBy?: string;
                  /** @description Last modified by, user name */
                  lastModifiedBy?: string;
                  /** @description Permissions for the record */
                  permissions?: {
                    [key: string]: {
                      [key: string]: boolean;
                    };
                  };
                  /** @description Whether the record is undeletable */
                  undeletable?: boolean;
                }[];
              extra?: {
                /** @description Group points for the view */
                groupPoints?: (({
                    id: string;
                    /** @enum {number} */
                    type: 0;
                    depth: number;
                    value?: unknown;
                    isCollapsed: boolean;
                  } | {
                    /** @enum {number} */
                    type: 1;
                    count: number;
                  })[]) | null;
                plugin?: {
                  pluginId: string;
                  pluginInstallId: string;
                  name: string;
                  url?: string;
                  storage?: {
                    [key: string]: unknown;
                  };
                };
              };
            };
          };
        };
      };
    };
  };
  "/share/{shareId}/view/aggregations": {
    /** @description Get share view aggregations */
    get: {
      parameters: {
        query?: {
          ignoreViewQuery?: string | boolean;
          filterByTql?: string;
          filter?: string;
          search?: string[] | ((string | (string | boolean))[]);
          filterLinkCellCandidate?: string[] | string;
          filterLinkCellSelected?: string[] | string;
          selectedRecordIds?: string[];
          groupBy?: string;
          field?: {
            count?: string[];
            empty?: string[];
            filled?: string[];
            unique?: string[];
            max?: string[];
            min?: string[];
            sum?: string[];
            average?: string[];
            checked?: string[];
            unChecked?: string[];
            percentEmpty?: string[];
            percentFilled?: string[];
            percentUnique?: string[];
            percentChecked?: string[];
            percentUnChecked?: string[];
            earliestDate?: string[];
            latestDate?: string[];
            dateRangeOfDays?: string[];
            dateRangeOfMonths?: string[];
            totalAttachmentSize?: string[];
          };
        };
        path: {
          shareId: string;
        };
      };
      responses: {
        /** @description Returns aggregations list of share view. */
        200: {
          content: {
            "application/json": ({
                id: string;
                name: string;
                /** @enum {string} */
                type: "grid" | "calendar" | "kanban" | "form" | "gallery" | "plugin";
                description?: string;
                order?: number;
                options?: ({
                  /**
                   * @description The row height level of row in view
                   * @enum {string}
                   */
                  rowHeight?: "short" | "medium" | "tall" | "extraTall" | "autoFit";
                  /** @description The field name display lines in view */
                  fieldNameDisplayLines?: number;
                  /** @description The frozen column count in view */
                  frozenColumnCount?: number;
                }) | ({
                  /** @description The field id of the Kanban stack. */
                  stackFieldId?: string;
                  /** @description The cover field id is a designated attachment field id, the contents of which appear at the top of each Kanban card. */
                  coverFieldId?: string | null;
                  /** @description If true, cover images are resized to fit Kanban cards. */
                  isCoverFit?: boolean;
                  /** @description If true, hides field name in the Kanban cards. */
                  isFieldNameHidden?: boolean;
                  /** @description If true, hides empty stacks in the Kanban. */
                  isEmptyStackHidden?: boolean;
                }) | ({
                  /** @description The cover field id is a designated attachment field id, the contents of which appear at the top of each gallery card. */
                  coverFieldId?: string | null;
                  /** @description If true, cover images are resized to fit gallery cards. */
                  isCoverFit?: boolean;
                  /** @description If true, hides field name in the gallery cards. */
                  isFieldNameHidden?: boolean;
                }) | ({
                  /** @description The start date field id. */
                  startDateFieldId?: string | null;
                  /** @description The end date field id. */
                  endDateFieldId?: string | null;
                  /** @description The title field id. */
                  titleFieldId?: string | null;
                  colorConfig?: ({
                    /** @enum {string} */
                    type: "field" | "custom";
                    /** @description The color field id. */
                    fieldId?: string | null;
                    /**
                     * @description The color.
                     * @enum {string|null}
                     */
                    color?: "blueLight2" | "blueLight1" | "blueBright" | "blue" | "blueDark1" | "cyanLight2" | "cyanLight1" | "cyanBright" | "cyan" | "cyanDark1" | "grayLight2" | "grayLight1" | "grayBright" | "gray" | "grayDark1" | "greenLight2" | "greenLight1" | "greenBright" | "green" | "greenDark1" | "orangeLight2" | "orangeLight1" | "orangeBright" | "orange" | "orangeDark1" | "pinkLight2" | "pinkLight1" | "pinkBright" | "pink" | "pinkDark1" | "purpleLight2" | "purpleLight1" | "purpleBright" | "purple" | "purpleDark1" | "redLight2" | "redLight1" | "redBright" | "red" | "redDark1" | "tealLight2" | "tealLight1" | "tealBright" | "teal" | "tealDark1" | "yellowLight2" | "yellowLight1" | "yellowBright" | "yellow" | "yellowDark1" | null;
                  }) | null;
                }) | {
                  /** @description The cover url of the form */
                  coverUrl?: string;
                  /** @description The logo url of the form */
                  logoUrl?: string;
                  /** @description The submit button text of the form */
                  submitLabel?: string;
                } | {
                  /** @description The plugin id */
                  pluginId: string;
                  /** @description The plugin install id */
                  pluginInstallId: string;
                  /** @description The plugin logo */
                  pluginLogo: string;
                };
                sort?: ({
                  sortObjs: ({
                      /** @description The id of the field. */
                      fieldId: string;
                      /** @enum {string} */
                      order: "asc" | "desc";
                    })[];
                  manualSort?: boolean;
                }) | null;
                /** @description A filter object for complex query conditions based on fields, operators, and values. Use our visual query builder at https://app.teable.ai/developer/tool/query-builder to build filters. */
                filter?: Record<string, never>;
                group?: (({
                    /** @description The id of the field. */
                    fieldId: string;
                    /** @enum {string} */
                    order: "asc" | "desc";
                  })[]) | null;
                isLocked?: boolean;
                shareId?: string;
                enableShare?: boolean;
                shareMeta?: {
                  allowCopy?: boolean;
                  includeHiddenField?: boolean;
                  password?: string;
                  includeRecords?: boolean;
                  submit?: {
                    allow?: boolean;
                    requireLogin?: boolean;
                  };
                };
                createdBy: string;
                lastModifiedBy?: string;
                createdTime: string;
                lastModifiedTime?: string;
                /** @description A mapping of view IDs to their corresponding column metadata. */
                columnMeta: {
                  [key: string]: ({
                    /** @description Order is a floating number, column will sort by it in the view. */
                    order: number;
                    /** @description Column width in the view. */
                    width?: number;
                    /** @description If column hidden in the view. */
                    hidden?: boolean;
                    /**
                     * @description Statistic function of the column in the view.
                     * @enum {string|null}
                     */
                    statisticFunc?: "count" | "empty" | "filled" | "unique" | "max" | "min" | "sum" | "average" | "checked" | "unChecked" | "percentEmpty" | "percentFilled" | "percentUnique" | "percentChecked" | "percentUnChecked" | "earliestDate" | "latestDate" | "dateRangeOfDays" | "dateRangeOfMonths" | "totalAttachmentSize" | null;
                  }) | {
                    /** @description Order is a floating number, column will sort by it in the view. */
                    order: number;
                    /** @description If column visible in the kanban view. */
                    visible?: boolean;
                  } | {
                    /** @description Order is a floating number, column will sort by it in the view. */
                    order: number;
                    /** @description If column visible in the gallery view. */
                    visible?: boolean;
                  } | {
                    /** @description Order is a floating number, column will sort by it in the view. */
                    order: number;
                    /** @description If column visible in the view. */
                    visible?: boolean;
                    /** @description If column is required. */
                    required?: boolean;
                  } | {
                    /** @description Order is a floating number, column will sort by it in the view. */
                    order: number;
                    /** @description If column hidden in the view. */
                    hidden?: boolean;
                  };
                };
                pluginId?: string;
              })[];
          };
        };
      };
    };
  };
  "/share/{shareId}/view/row-count": {
    /** @description Get row count for the share view */
    get: {
      parameters: {
        query?: {
          ignoreViewQuery?: string | boolean;
          filterByTql?: string;
          filter?: string;
          search?: string[] | ((string | (string | boolean))[]);
          filterLinkCellCandidate?: string[] | string;
          filterLinkCellSelected?: string[] | string;
          selectedRecordIds?: string[];
        };
        path: {
          shareId: string;
        };
      };
      responses: {
        /** @description Row count for the share view */
        200: {
          content: {
            "application/json": {
              rowCount: number;
            };
          };
        };
      };
    };
  };
  "/share/{shareId}/view/form-submit": {
    /** @description share form view submit new record */
    post: {
      parameters: {
        path: {
          shareId: string;
        };
      };
      requestBody?: {
        content: {
          "application/json": {
            /** @description Objects with a fields key mapping fieldId or field name to value for that field. */
            fields: {
              [key: string]: unknown;
            };
            typecast?: boolean;
          };
        };
      };
      responses: {
        /** @description Successfully submit */
        201: {
          content: {
            "application/json": {
              /** @description The record id. */
              id: string;
              /** @description primary field value */
              name?: string;
              /** @description Objects with a fields key mapping fieldId or field name to value for that field. */
              fields: {
                [key: string]: unknown;
              };
              /** @description Auto number, a unique identifier for each record */
              autoNumber?: number;
              /** @description Created time, date ISO string (new Date().toISOString). */
              createdTime?: string;
              /** @description Last modified time, date ISO string (new Date().toISOString). */
              lastModifiedTime?: string;
              /** @description Created by, user name */
              createdBy?: string;
              /** @description Last modified by, user name */
              lastModifiedBy?: string;
              /** @description Permissions for the record */
              permissions?: {
                [key: string]: {
                  [key: string]: boolean;
                };
              };
              /** @description Whether the record is undeletable */
              undeletable?: boolean;
            };
          };
        };
      };
    };
  };
  "/share/{shareId}/view/copy": {
    /** @description Copy operations in Share view */
    get: {
      parameters: {
        query: {
          viewId?: string;
          ignoreViewQuery?: string | boolean;
          filterByTql?: string;
          filter?: string;
          search?: string[] | ((string | (string | boolean))[]);
          filterLinkCellCandidate?: string[] | string;
          filterLinkCellSelected?: string[] | string;
          selectedRecordIds?: string[];
          orderBy?: string;
          groupBy?: string;
          collapsedGroupIds?: string;
          queryId?: string;
          projection?: string[];
          ranges: string;
          type?: "rows" | "columns";
        };
        path: {
          shareId: string;
        };
      };
      responses: {
        /** @description Copy content */
        200: {
          content: {
            "application/json": {
              content: string;
              header: ({
                  /** @description The id of the field. */
                  id: string;
                  /**
                   * @description The name of the field. can not be duplicated in the table.
                   * @example Tags
                   */
                  name: string;
                  /**
                   * @description The field types supported by teable.
                   * @example singleSelect
                   * @enum {string}
                   */
                  type: "singleLineText" | "longText" | "user" | "attachment" | "checkbox" | "multipleSelect" | "singleSelect" | "date" | "number" | "rating" | "formula" | "rollup" | "link" | "createdTime" | "lastModifiedTime" | "createdBy" | "lastModifiedBy" | "autoNumber" | "button" | "department" | "createdByDepartment" | "lastModifiedByDepartment";
                  /**
                   * @description The description of the field.
                   * @example this is a summary
                   */
                  description?: string;
                  /** @description The configuration options of the field. The structure of the field's options depend on the field's type. */
                  options: ({
                    /** @enum {string} */
                    expression: "countall({values})" | "counta({values})" | "count({values})" | "sum({values})" | "max({values})" | "min({values})" | "and({values})" | "or({values})" | "xor({values})" | "array_join({values})" | "array_unique({values})" | "array_compact({values})" | "concatenate({values})";
                    /** @description The time zone that should be used to format dates */
                    timeZone?: string;
                    /** @description Different cell value types are determined based on the results of expression parsing, where numbers, dates, and formatting options are provided */
                    formatting?: ({
                      /** @description the display formatting of the date. you can use the following presets: M/D/YYYY, D/M/YYYY, YYYY/MM/DD, YYYY-MM-DD, YYYY-MM, MM-DD, YYYY, MM, DD */
                      date: string;
                      /**
                       * @description the display formatting of the time. you can use the following presets: HH:mm, hh:mm A, None
                       * @enum {string}
                       */
                      time: "HH:mm" | "hh:mm A" | "None";
                      /** @description The time zone that should be used to format dates */
                      timeZone: string;
                    }) | {
                      precision: number;
                      /** @enum {string} */
                      type: "decimal";
                    } | {
                      precision: number;
                      /** @enum {string} */
                      type: "percent";
                    } | {
                      precision: number;
                      /** @enum {string} */
                      type: "currency";
                      symbol: string;
                    };
                    /** @description According to the results of expression parsing to determine different visual effects, where strings, numbers will provide customized "show as" */
                    showAs?: ({
                      /**
                       * @description can display as url, email or phone in string field with a button to perform the corresponding action, start a phone call, send an email, or open a link in a new tab
                       * @enum {string}
                       */
                      type: "url" | "email" | "phone";
                    }) | ({
                      /**
                       * @description can display as bar or ring in number field with single cellValue value
                       * @enum {string}
                       */
                      type: "bar" | "ring";
                      /** @enum {string} */
                      color: "blueLight2" | "blueLight1" | "blueBright" | "blue" | "blueDark1" | "cyanLight2" | "cyanLight1" | "cyanBright" | "cyan" | "cyanDark1" | "grayLight2" | "grayLight1" | "grayBright" | "gray" | "grayDark1" | "greenLight2" | "greenLight1" | "greenBright" | "green" | "greenDark1" | "orangeLight2" | "orangeLight1" | "orangeBright" | "orange" | "orangeDark1" | "pinkLight2" | "pinkLight1" | "pinkBright" | "pink" | "pinkDark1" | "purpleLight2" | "purpleLight1" | "purpleBright" | "purple" | "purpleDark1" | "redLight2" | "redLight1" | "redBright" | "red" | "redDark1" | "tealLight2" | "tealLight1" | "tealBright" | "teal" | "tealDark1" | "yellowLight2" | "yellowLight1" | "yellowBright" | "yellow" | "yellowDark1";
                      /** @description whether to displays the specific value on the graph */
                      showValue: boolean;
                      /** @description the value that represents a 100% maximum value, it does not represent a hard limit on the value */
                      maxValue: number;
                    }) | ({
                      /**
                       * @description can display as bar or line in number field with multiple cellValue value
                       * @enum {string}
                       */
                      type: "bar" | "line";
                      /** @enum {string} */
                      color: "blueLight2" | "blueLight1" | "blueBright" | "blue" | "blueDark1" | "cyanLight2" | "cyanLight1" | "cyanBright" | "cyan" | "cyanDark1" | "grayLight2" | "grayLight1" | "grayBright" | "gray" | "grayDark1" | "greenLight2" | "greenLight1" | "greenBright" | "green" | "greenDark1" | "orangeLight2" | "orangeLight1" | "orangeBright" | "orange" | "orangeDark1" | "pinkLight2" | "pinkLight1" | "pinkBright" | "pink" | "pinkDark1" | "purpleLight2" | "purpleLight1" | "purpleBright" | "purple" | "purpleDark1" | "redLight2" | "redLight1" | "redBright" | "red" | "redDark1" | "tealLight2" | "tealLight1" | "tealBright" | "teal" | "tealDark1" | "yellowLight2" | "yellowLight1" | "yellowBright" | "yellow" | "yellowDark1";
                    });
                  }) | ({
                    /** @description The formula including fields referenced by their IDs. For example, LEFT(4, {Birthday}) input will be returned as LEFT(4, {fldXXX}) via API. The formula syntax in Teable is basically the same as Airtable */
                    expression: string;
                    /** @description The time zone that should be used to format dates */
                    timeZone?: string;
                    /** @description Different cell value types are determined based on the results of expression parsing, where numbers, dates, and formatting options are provided */
                    formatting?: ({
                      /** @description the display formatting of the date. you can use the following presets: M/D/YYYY, D/M/YYYY, YYYY/MM/DD, YYYY-MM-DD, YYYY-MM, MM-DD, YYYY, MM, DD */
                      date: string;
                      /**
                       * @description the display formatting of the time. you can use the following presets: HH:mm, hh:mm A, None
                       * @enum {string}
                       */
                      time: "HH:mm" | "hh:mm A" | "None";
                      /** @description The time zone that should be used to format dates */
                      timeZone: string;
                    }) | {
                      precision: number;
                      /** @enum {string} */
                      type: "decimal";
                    } | {
                      precision: number;
                      /** @enum {string} */
                      type: "percent";
                    } | {
                      precision: number;
                      /** @enum {string} */
                      type: "currency";
                      symbol: string;
                    };
                    /** @description According to the results of expression parsing to determine different visual effects, where strings, numbers will provide customized "show as" */
                    showAs?: ({
                      /**
                       * @description can display as url, email or phone in string field with a button to perform the corresponding action, start a phone call, send an email, or open a link in a new tab
                       * @enum {string}
                       */
                      type: "url" | "email" | "phone";
                    }) | ({
                      /**
                       * @description can display as bar or ring in number field with single cellValue value
                       * @enum {string}
                       */
                      type: "bar" | "ring";
                      /** @enum {string} */
                      color: "blueLight2" | "blueLight1" | "blueBright" | "blue" | "blueDark1" | "cyanLight2" | "cyanLight1" | "cyanBright" | "cyan" | "cyanDark1" | "grayLight2" | "grayLight1" | "grayBright" | "gray" | "grayDark1" | "greenLight2" | "greenLight1" | "greenBright" | "green" | "greenDark1" | "orangeLight2" | "orangeLight1" | "orangeBright" | "orange" | "orangeDark1" | "pinkLight2" | "pinkLight1" | "pinkBright" | "pink" | "pinkDark1" | "purpleLight2" | "purpleLight1" | "purpleBright" | "purple" | "purpleDark1" | "redLight2" | "redLight1" | "redBright" | "red" | "redDark1" | "tealLight2" | "tealLight1" | "tealBright" | "teal" | "tealDark1" | "yellowLight2" | "yellowLight1" | "yellowBright" | "yellow" | "yellowDark1";
                      /** @description whether to displays the specific value on the graph */
                      showValue: boolean;
                      /** @description the value that represents a 100% maximum value, it does not represent a hard limit on the value */
                      maxValue: number;
                    }) | ({
                      /**
                       * @description can display as bar or line in number field with multiple cellValue value
                       * @enum {string}
                       */
                      type: "bar" | "line";
                      /** @enum {string} */
                      color: "blueLight2" | "blueLight1" | "blueBright" | "blue" | "blueDark1" | "cyanLight2" | "cyanLight1" | "cyanBright" | "cyan" | "cyanDark1" | "grayLight2" | "grayLight1" | "grayBright" | "gray" | "grayDark1" | "greenLight2" | "greenLight1" | "greenBright" | "green" | "greenDark1" | "orangeLight2" | "orangeLight1" | "orangeBright" | "orange" | "orangeDark1" | "pinkLight2" | "pinkLight1" | "pinkBright" | "pink" | "pinkDark1" | "purpleLight2" | "purpleLight1" | "purpleBright" | "purple" | "purpleDark1" | "redLight2" | "redLight1" | "redBright" | "red" | "redDark1" | "tealLight2" | "tealLight1" | "tealBright" | "teal" | "tealDark1" | "yellowLight2" | "yellowLight1" | "yellowBright" | "yellow" | "yellowDark1";
                    });
                  }) | ({
                    /** @description the base id of the table that this field is linked to, only required for cross base link */
                    baseId?: string;
                    /**
                     * @description describe the relationship from this table to the foreign table
                     * @enum {string}
                     */
                    relationship: "oneOne" | "manyMany" | "oneMany" | "manyOne";
                    /** @description the table this field is linked to */
                    foreignTableId: string;
                    /** @description the field in the foreign table that will be displayed as the current field */
                    lookupFieldId: string;
                    /** @description whether the field is a one-way link, when true, it will not generate a symmetric field, it is generally has better performance */
                    isOneWay?: boolean;
                    /** @description the table name for storing keys, in many-to-many relationships, keys are stored in a separate intermediate table; in other relationships, keys are stored on one side as needed */
                    fkHostTableName: string;
                    /** @description the name of the field that stores the current table primary key */
                    selfKeyName: string;
                    /** @description The name of the field that stores the foreign table primary key */
                    foreignKeyName: string;
                    /** @description the symmetric field in the foreign table, empty if the field is a one-way link */
                    symmetricFieldId?: string;
                    /** @description the view id that limits the number of records in the link field */
                    filterByViewId?: string | null;
                    /** @description the fields that will be displayed in the link field */
                    visibleFieldIds?: string[] | null;
                    /** @description A filter object for complex query conditions based on fields, operators, and values. Use our visual query builder at https://app.teable.ai/developer/tool/query-builder to build filters. */
                    filter?: Record<string, never>;
                  }) | ({
                    /** @description caveat: the formatting is just a formatter, it dose not effect the storing value of the record */
                    formatting: {
                      /** @description the display formatting of the date. you can use the following presets: M/D/YYYY, D/M/YYYY, YYYY/MM/DD, YYYY-MM-DD, YYYY-MM, MM-DD, YYYY, MM, DD */
                      date: string;
                      /**
                       * @description the display formatting of the time. you can use the following presets: HH:mm, hh:mm A, None
                       * @enum {string}
                       */
                      time: "HH:mm" | "hh:mm A" | "None";
                      /** @description The time zone that should be used to format dates */
                      timeZone: string;
                    };
                    /**
                     * @description Whether the new row is automatically filled with the current time, caveat: the defaultValue is just a flag, it dose not effect the storing value of the record
                     * @enum {string}
                     */
                    defaultValue?: "now";
                  }) | {
                    defaultValue?: boolean;
                  } | Record<string, never> | ({
                    /** @description Only be used in single line text field or formula / rollup field with cellValueType equals String and isMultipleCellValue is not true */
                    showAs?: {
                      /**
                       * @description can display as url, email or phone in string field with a button to perform the corresponding action, start a phone call, send an email, or open a link in a new tab
                       * @enum {string}
                       */
                      type: "url" | "email" | "phone";
                    };
                    defaultValue?: string;
                  }) | ({
                    /** @enum {string} */
                    icon: "star" | "moon" | "sun" | "zap" | "flame" | "heart" | "apple" | "thumb-up";
                    /** @enum {string} */
                    color: "yellowBright" | "redBright" | "tealBright";
                    max: number;
                  }) | ({
                    /** @description Allow adding multiple users */
                    isMultiple?: boolean;
                    /** @description Notify users when their name is added to a cell */
                    shouldNotify?: boolean;
                    defaultValue?: string | "me" | ((string | "me")[]);
                  }) | ({
                    /** @description Button label */
                    label: string;
                    /**
                     * @description Button color
                     * @enum {string}
                     */
                    color: "blueLight2" | "blueLight1" | "blueBright" | "blue" | "blueDark1" | "cyanLight2" | "cyanLight1" | "cyanBright" | "cyan" | "cyanDark1" | "grayLight2" | "grayLight1" | "grayBright" | "gray" | "grayDark1" | "greenLight2" | "greenLight1" | "greenBright" | "green" | "greenDark1" | "orangeLight2" | "orangeLight1" | "orangeBright" | "orange" | "orangeDark1" | "pinkLight2" | "pinkLight1" | "pinkBright" | "pink" | "pinkDark1" | "purpleLight2" | "purpleLight1" | "purpleBright" | "purple" | "purpleDark1" | "redLight2" | "redLight1" | "redBright" | "red" | "redDark1" | "tealLight2" | "tealLight1" | "tealBright" | "teal" | "tealDark1" | "yellowLight2" | "yellowLight1" | "yellowBright" | "yellow" | "yellowDark1";
                    /** @description Max count of button clicks */
                    maxCount?: number;
                    /** @description Reset count */
                    resetCount?: boolean;
                    /** @description Workflow */
                    workflow?: {
                      /** @description Workflow ID */
                      id?: string;
                      /** @description Workflow Name */
                      name?: string;
                      /** @description Workflow is active */
                      isActive?: boolean;
                    } | null;
                  }) | ({
                    choices: ({
                        id: string;
                        name: string;
                        /** @enum {string} */
                        color: "blueLight2" | "blueLight1" | "blueBright" | "blue" | "blueDark1" | "cyanLight2" | "cyanLight1" | "cyanBright" | "cyan" | "cyanDark1" | "grayLight2" | "grayLight1" | "grayBright" | "gray" | "grayDark1" | "greenLight2" | "greenLight1" | "greenBright" | "green" | "greenDark1" | "orangeLight2" | "orangeLight1" | "orangeBright" | "orange" | "orangeDark1" | "pinkLight2" | "pinkLight1" | "pinkBright" | "pink" | "pinkDark1" | "purpleLight2" | "purpleLight1" | "purpleBright" | "purple" | "purpleDark1" | "redLight2" | "redLight1" | "redBright" | "red" | "redDark1" | "tealLight2" | "tealLight1" | "tealBright" | "teal" | "tealDark1" | "yellowLight2" | "yellowLight1" | "yellowBright" | "yellow" | "yellowDark1";
                      })[];
                    defaultValue?: string | string[];
                    preventAutoNewOptions?: boolean;
                  }) | ({
                    /** @description Only be used in number field (number field or formula / rollup field with cellValueType equals Number */
                    formatting: {
                      precision: number;
                      /** @enum {string} */
                      type: "decimal";
                    } | {
                      precision: number;
                      /** @enum {string} */
                      type: "percent";
                    } | {
                      precision: number;
                      /** @enum {string} */
                      type: "currency";
                      symbol: string;
                    };
                    /** @description Only be used in number field (number field or formula / rollup field with cellValueType equals Number */
                    showAs?: ({
                      /**
                       * @description can display as bar or ring in number field with single cellValue value
                       * @enum {string}
                       */
                      type: "bar" | "ring";
                      /** @enum {string} */
                      color: "blueLight2" | "blueLight1" | "blueBright" | "blue" | "blueDark1" | "cyanLight2" | "cyanLight1" | "cyanBright" | "cyan" | "cyanDark1" | "grayLight2" | "grayLight1" | "grayBright" | "gray" | "grayDark1" | "greenLight2" | "greenLight1" | "greenBright" | "green" | "greenDark1" | "orangeLight2" | "orangeLight1" | "orangeBright" | "orange" | "orangeDark1" | "pinkLight2" | "pinkLight1" | "pinkBright" | "pink" | "pinkDark1" | "purpleLight2" | "purpleLight1" | "purpleBright" | "purple" | "purpleDark1" | "redLight2" | "redLight1" | "redBright" | "red" | "redDark1" | "tealLight2" | "tealLight1" | "tealBright" | "teal" | "tealDark1" | "yellowLight2" | "yellowLight1" | "yellowBright" | "yellow" | "yellowDark1";
                      /** @description whether to displays the specific value on the graph */
                      showValue: boolean;
                      /** @description the value that represents a 100% maximum value, it does not represent a hard limit on the value */
                      maxValue: number;
                    }) | ({
                      /**
                       * @description can display as bar or line in number field with multiple cellValue value
                       * @enum {string}
                       */
                      type: "bar" | "line";
                      /** @enum {string} */
                      color: "blueLight2" | "blueLight1" | "blueBright" | "blue" | "blueDark1" | "cyanLight2" | "cyanLight1" | "cyanBright" | "cyan" | "cyanDark1" | "grayLight2" | "grayLight1" | "grayBright" | "gray" | "grayDark1" | "greenLight2" | "greenLight1" | "greenBright" | "green" | "greenDark1" | "orangeLight2" | "orangeLight1" | "orangeBright" | "orange" | "orangeDark1" | "pinkLight2" | "pinkLight1" | "pinkBright" | "pink" | "pinkDark1" | "purpleLight2" | "purpleLight1" | "purpleBright" | "purple" | "purpleDark1" | "redLight2" | "redLight1" | "redBright" | "red" | "redDark1" | "tealLight2" | "tealLight1" | "tealBright" | "teal" | "tealDark1" | "yellowLight2" | "yellowLight1" | "yellowBright" | "yellow" | "yellowDark1";
                    });
                    defaultValue?: number;
                  }) | {
                    /** @enum {string} */
                    expression: "AUTO_NUMBER()";
                  } | ({
                    /** @enum {string} */
                    expression: "CREATED_TIME()";
                    /** @description caveat: the formatting is just a formatter, it dose not effect the storing value of the record */
                    formatting: {
                      /** @description the display formatting of the date. you can use the following presets: M/D/YYYY, D/M/YYYY, YYYY/MM/DD, YYYY-MM-DD, YYYY-MM, MM-DD, YYYY, MM, DD */
                      date: string;
                      /**
                       * @description the display formatting of the time. you can use the following presets: HH:mm, hh:mm A, None
                       * @enum {string}
                       */
                      time: "HH:mm" | "hh:mm A" | "None";
                      /** @description The time zone that should be used to format dates */
                      timeZone: string;
                    };
                  }) | ({
                    /** @enum {string} */
                    expression: "LAST_MODIFIED_TIME()";
                    /** @description caveat: the formatting is just a formatter, it dose not effect the storing value of the record */
                    formatting: {
                      /** @description the display formatting of the date. you can use the following presets: M/D/YYYY, D/M/YYYY, YYYY/MM/DD, YYYY-MM-DD, YYYY-MM, MM-DD, YYYY, MM, DD */
                      date: string;
                      /**
                       * @description the display formatting of the time. you can use the following presets: HH:mm, hh:mm A, None
                       * @enum {string}
                       */
                      time: "HH:mm" | "hh:mm A" | "None";
                      /** @description The time zone that should be used to format dates */
                      timeZone: string;
                    };
                  });
                  /** @description The AI configuration of the field. */
                  aiConfig?: unknown;
                  /** @description Whether this field is lookup field. witch means cellValue and [fieldType] is looked up from the linked table. */
                  isLookup?: boolean;
                  /** @description field lookup options. */
                  lookupOptions?: {
                    /** @description the table this field is linked to */
                    foreignTableId: string;
                    /** @description the field in the foreign table that will be displayed as the current field */
                    lookupFieldId: string;
                    /**
                     * @description describe the relationship from this table to the foreign table
                     * @enum {string}
                     */
                    relationship: "oneOne" | "manyMany" | "oneMany" | "manyOne";
                    /** @description the table name for storing keys, in many-to-many relationships, keys are stored in a separate intermediate table; in other relationships, keys are stored on one side as needed */
                    fkHostTableName: string;
                    /** @description the name of the field that stores the current table primary key */
                    selfKeyName: string;
                    /** @description The name of the field that stores the foreign table primary key */
                    foreignKeyName: string;
                    /** @description A filter object for complex query conditions based on fields, operators, and values. Use our visual query builder at https://app.teable.ai/developer/tool/query-builder to build filters. */
                    filter?: Record<string, never>;
                    /** @description The id of Linked record field to use for lookup */
                    linkFieldId: string;
                  };
                  /** @description Whether this field is not null. */
                  notNull?: boolean;
                  /** @description Whether this field is not unique. */
                  unique?: boolean;
                  /** @description Whether this field is primary field. */
                  isPrimary?: boolean;
                  /** @description Whether this field is computed field, you can not modify cellValue in computed field. */
                  isComputed?: boolean;
                  /** @description Whether this field's calculation is pending. */
                  isPending?: boolean;
                  /** @description Whether This field has a configuration error. Check the fields referenced by this field's formula or configuration. */
                  hasError?: boolean;
                  /**
                   * @description The cell value type of the field.
                   * @enum {string}
                   */
                  cellValueType: "string" | "number" | "boolean" | "dateTime";
                  /** @description Whether this field has multiple cell value. */
                  isMultipleCellValue?: boolean;
                  /**
                   * @description The field type of database that cellValue really store.
                   * @enum {string}
                   */
                  dbFieldType: "TEXT" | "INTEGER" | "DATETIME" | "REAL" | "BLOB" | "JSON" | "BOOLEAN";
                  /** @description Field(column) name in backend database. Limitation: 1-63 characters, can only contain letters, numbers and underscore, case sensitive, cannot be duplicated with existing db field name in the table. */
                  dbFieldName: string;
                  /** @description Field record read permission. When set to false, reading records is denied. When true or not set, reading records is allowed. */
                  recordRead?: boolean;
                  /** @description Field record create permission. When set to false, creating records is denied. When true or not set, creating records is allowed. */
                  recordCreate?: boolean;
                })[];
            };
          };
        };
      };
    };
  };
  "/share/{shareId}/view/group-points": {
    /** @description Get group points for the share view */
    get: {
      parameters: {
        query?: {
          filter?: string;
          search?: string[] | ((string | (string | boolean))[]);
          groupBy?: string;
          collapsedGroupIds?: string;
          ignoreViewQuery?: string | boolean;
        };
        path: {
          shareId: string;
        };
      };
      responses: {
        /** @description Group points for the share view */
        200: {
          content: {
            "application/json": (({
                id: string;
                /** @enum {number} */
                type: 0;
                depth: number;
                value?: unknown;
                isCollapsed: boolean;
              } | {
                /** @enum {number} */
                type: 1;
                count: number;
              })[]) | null;
          };
        };
      };
    };
  };
  "/share/{shareId}/view/link-records": {
    /** @description In a view with a field selector, link the records list of the associated field selector to get the. Linking the desired ones inside the share view should fetch the ones that have already been selected. */
    get: {
      parameters: {
        query: {
          take?: string | number;
          skip?: string | number;
          fieldId: string;
          search?: string;
          type?: "candidate" | "selected";
        };
        path: {
          shareId: string;
        };
      };
      responses: {
        /** @description Link records list */
        200: {
          content: {
            "application/json": {
                id: string;
                title?: string;
              }[];
          };
        };
      };
    };
  };
  "/share/{shareId}/view/collaborators": {
    /** @description View collaborators in a view with a user field selector. */
    get: {
      parameters: {
        query?: {
          fieldId?: string;
          skip?: number | null;
          take?: number | null;
          search?: string;
          type?: "user" | "department";
        };
        path: {
          shareId: string;
        };
      };
      responses: {
        /** @description  view collaborators */
        200: {
          content: {
            "application/json": ({
                userId: string;
                userName: string;
                email: string;
                avatar?: string | null;
              })[];
          };
        };
      };
    };
  };
  "/share/{shareId}/view/search-count": {
    /** @description Get share view search result count with query */
    get: {
      parameters: {
        query?: {
          filter?: string;
          viewId?: string;
          search?: string[] | ((string | (string | boolean))[]);
          ignoreViewQuery?: string | boolean;
        };
        path: {
          shareId: string;
        };
      };
      responses: {
        /** @description Share view Search count with query */
        200: {
          content: {
            "application/json": {
              count: number;
            };
          };
        };
      };
    };
  };
  "/share/{shareId}/view/search-index": {
    /** @description Get share view record index with search query */
    get: {
      parameters: {
        query?: {
          viewId?: string;
          ignoreViewQuery?: string | boolean;
          filterByTql?: string;
          filter?: string;
          search?: string[] | ((string | (string | boolean))[]);
          filterLinkCellCandidate?: string[] | string;
          filterLinkCellSelected?: string[] | string;
          selectedRecordIds?: string[];
        };
        path: {
          shareId: string;
        };
      };
      responses: {
        /** @description share view record index with search query */
        200: {
          content: {
            "application/json": {
                index: number;
                fieldId: string;
                recordId: string;
              }[] | null;
          };
        };
      };
    };
  };
  "/share/{shareId}/view/calendar-daily-collection": {
    /** @description Get calendar daily collection for the share view */
    get: {
      parameters: {
        query: {
          filter?: string;
          search?: string[] | ((string | (string | boolean))[]);
          ignoreViewQuery?: string | boolean;
          startDate: string;
          endDate: string;
          startDateFieldId: string;
          endDateFieldId: string;
        };
        path: {
          shareId: string;
        };
      };
      responses: {
        /** @description Calendar daily collection for the share view */
        200: {
          content: {
            "application/json": {
              countMap: {
                [key: string]: number;
              };
              records: {
                  /** @description The record id. */
                  id: string;
                  /** @description primary field value */
                  name?: string;
                  /** @description Objects with a fields key mapping fieldId or field name to value for that field. */
                  fields: {
                    [key: string]: unknown;
                  };
                  /** @description Auto number, a unique identifier for each record */
                  autoNumber?: number;
                  /** @description Created time, date ISO string (new Date().toISOString). */
                  createdTime?: string;
                  /** @description Last modified time, date ISO string (new Date().toISOString). */
                  lastModifiedTime?: string;
                  /** @description Created by, user name */
                  createdBy?: string;
                  /** @description Last modified by, user name */
                  lastModifiedBy?: string;
                  /** @description Permissions for the record */
                  permissions?: {
                    [key: string]: {
                      [key: string]: boolean;
                    };
                  };
                  /** @description Whether the record is undeletable */
                  undeletable?: boolean;
                }[];
            };
          };
        };
      };
    };
  };
  "/share/{shareId}/view/record/{recordId}/{fieldId}/button-click": {
    /**
     * Button click
     * @description Button click
     */
    post: {
      parameters: {
        path: {
          shareId: string;
          recordId: string;
          fieldId: string;
        };
      };
      responses: {
        /** @description Returns the clicked cell */
        200: {
          content: {
            "application/json": {
              runId: string;
              tableId: string;
              fieldId: string;
              record: {
                /** @description The record id. */
                id: string;
                /** @description primary field value */
                name?: string;
                /** @description Objects with a fields key mapping fieldId or field name to value for that field. */
                fields: {
                  [key: string]: unknown;
                };
                /** @description Auto number, a unique identifier for each record */
                autoNumber?: number;
                /** @description Created time, date ISO string (new Date().toISOString). */
                createdTime?: string;
                /** @description Last modified time, date ISO string (new Date().toISOString). */
                lastModifiedTime?: string;
                /** @description Created by, user name */
                createdBy?: string;
                /** @description Last modified by, user name */
                lastModifiedBy?: string;
                /** @description Permissions for the record */
                permissions?: {
                  [key: string]: {
                    [key: string]: boolean;
                  };
                };
                /** @description Whether the record is undeletable */
                undeletable?: boolean;
              };
            };
          };
        };
      };
    };
  };
  "/notifications": {
    /** @description List a user notification */
    get: {
      parameters: {
        query: {
          notifyStates: "unread" | "read";
          cursor?: string | null;
        };
      };
      responses: {
        /** @description Successful response, return user notification list. */
        200: {
          content: {
            "application/json": {
              notifications: ({
                  id: string;
                  notifyIcon: {
                    iconUrl: string;
                  } | ({
                    userId: string;
                    userName: string;
                    userAvatarUrl?: string | null;
                  });
                  /** @enum {string} */
                  notifyType: "system" | "collaboratorCellTag" | "collaboratorMultiRowTag" | "comment" | "exportBase";
                  url: string;
                  message: string;
                  isRead: boolean;
                  createdTime: string;
                })[];
              nextCursor?: string | null;
            };
          };
        };
      };
    };
  };
  "/notifications/{notificationId}/status": {
    /** @description Patch notification status */
    patch: {
      parameters: {
        path: {
          notificationId: string;
        };
      };
      requestBody?: {
        content: {
          "application/json": {
            isRead: boolean;
          };
        };
      };
      responses: {
        /** @description Returns successfully patch notification status */
        200: {
          content: never;
        };
      };
    };
  };
  "/notifications/read-all": {
    /** @description mark all notifications as read */
    patch: {
      responses: {
        /** @description Returns successfully */
        200: {
          content: never;
        };
      };
    };
  };
  "/notifications/unread-count": {
    /** @description User notification unread count */
    get: {
      responses: {
        /** @description Successful response, return user notification unread count. */
        200: {
          content: {
            "application/json": {
              unreadCount: number;
            };
          };
        };
      };
    };
  };
  "/access-token": {
    /** @description List access token */
    get: {
      responses: {
        /** @description Returns access token. */
        200: {
          content: {
            "application/json": {
                id: string;
                name: string;
                description?: string;
                scopes: string[];
                spaceIds?: string[];
                baseIds?: string[];
                hasFullAccess?: boolean;
                expiredTime: string;
                createdTime: string;
                lastUsedTime?: string;
              }[];
          };
        };
      };
    };
    /** @description Create access token */
    post: {
      requestBody?: {
        content: {
          "application/json": {
            name: string;
            description?: string;
            scopes: string[];
            spaceIds?: string[] | null;
            baseIds?: string[] | null;
            hasFullAccess?: boolean;
            /** @example 2024-03-25 */
            expiredTime: string;
          };
        };
      };
      responses: {
        /** @description Returns access token. */
        201: {
          content: {
            "application/json": {
              id: string;
              name: string;
              description?: string;
              scopes: string[];
              spaceIds?: string[] | null;
              baseIds?: string[] | null;
              hasFullAccess?: boolean;
              expiredTime: string;
              token: string;
              createdTime: string;
              lastUsedTime: string;
            };
          };
        };
      };
    };
  };
  "/access-token/{id}/refresh": {
    /** @description Refresh access token */
    post: {
      parameters: {
        path: {
          id: string;
        };
      };
      requestBody?: {
        content: {
          "application/json": {
            expiredTime: string;
          };
        };
      };
      responses: {
        /** @description Returns access token. */
        201: {
          content: {
            "application/json": {
              id: string;
              expiredTime: string;
              token: string;
            };
          };
        };
      };
    };
  };
  "/access-token/{id}": {
    /** @description Get access token */
    get: {
      parameters: {
        path: {
          id: string;
        };
      };
      responses: {
        /** @description Returns access token. */
        200: {
          content: {
            "application/json": {
              id: string;
              name: string;
              description?: string;
              scopes: string[];
              spaceIds?: string[];
              baseIds?: string[];
              hasFullAccess?: boolean;
              expiredTime: string;
              createdTime: string;
              lastUsedTime?: string;
            };
          };
        };
      };
    };
    /** @description Update access token */
    put: {
      parameters: {
        path: {
          id: string;
        };
      };
      requestBody?: {
        content: {
          "application/json": {
            name: string;
            description?: string;
            scopes: string[];
            spaceIds?: string[] | null;
            baseIds?: string[] | null;
            hasFullAccess?: boolean;
          };
        };
      };
      responses: {
        /** @description Returns access token. */
        200: {
          content: {
            "application/json": {
              id: string;
              name: string;
              description?: string;
              scopes: string[];
              spaceIds?: string[];
              baseIds?: string[];
              hasFullAccess?: boolean;
            };
          };
        };
      };
    };
    /** @description Delete access token */
    delete: {
      parameters: {
        path: {
          id: string;
        };
      };
      responses: {
        /** @description Access token deleted. */
        200: {
          content: never;
        };
      };
    };
  };
  "/import/analyze": {
    /** @description Get a column info from analyze sheet */
    get: {
      parameters: {
        query: {
          attachmentUrl: string;
          fileType: "csv" | "excel";
        };
      };
      responses: {
        /** @description Returns columnHeader analyze from file */
        200: {
          content: {
            "application/json": {
              worksheets: {
                [key: string]: {
                  name: string;
                  columns: ({
                      /** @enum {string} */
                      type: "singleLineText" | "longText" | "user" | "attachment" | "checkbox" | "multipleSelect" | "singleSelect" | "date" | "number" | "rating" | "formula" | "rollup" | "link" | "createdTime" | "lastModifiedTime" | "createdBy" | "lastModifiedBy" | "autoNumber" | "button" | "department" | "createdByDepartment" | "lastModifiedByDepartment";
                      name: string;
                    })[];
                };
              };
            };
          };
        };
      };
    };
  };
  "/import/{baseId}": {
    /** @description create table from file */
    post: {
      parameters: {
        path: {
          baseId: string;
        };
      };
      requestBody?: {
        content: {
          "application/json": {
            worksheets: {
              [key: string]: {
                name: string;
                columns: ({
                    /** @enum {string} */
                    type: "singleLineText" | "longText" | "user" | "attachment" | "checkbox" | "multipleSelect" | "singleSelect" | "date" | "number" | "rating" | "formula" | "rollup" | "link" | "createdTime" | "lastModifiedTime" | "createdBy" | "lastModifiedBy" | "autoNumber" | "button" | "department" | "createdByDepartment" | "lastModifiedByDepartment";
                    name: string;
                    sourceColumnIndex: number;
                  })[];
                useFirstRowAsHeader: boolean;
                importData: boolean;
              };
            };
            attachmentUrl: string;
            /** @enum {string} */
            fileType: "csv" | "excel";
            notification?: boolean;
            /** @description The time zone that should be used to format dates */
            tz: string;
          };
        };
      };
      responses: {
        /** @description Returns data about a table without records */
        201: {
          content: {
            "application/json": {
              /** @description The id of table. */
              id: string;
              /** @description The name of the table. */
              name: string;
              /** @description Table name in backend database. Limitation: 1-63 characters, start with letter, can only contain letters, numbers and underscore, case insensitive, cannot be duplicated with existing db table name in the base. */
              dbTableName: string;
              /** @description The description of the table. */
              description?: string;
              /** @description The emoji icon string of the table. */
              icon?: string;
              order?: number;
              /** @description The last modified time of the table. */
              lastModifiedTime?: string;
              /** @description The default view id of the table. */
              defaultViewId?: string;
            };
          };
        };
      };
    };
  };
  "/import/{baseId}/{tableId}": {
    /** @description import table inplace */
    patch: {
      parameters: {
        path: {
          baseId: string;
          tableId: string;
        };
      };
      requestBody?: {
        content: {
          "application/json": {
            attachmentUrl: string;
            /** @enum {string} */
            fileType: "csv" | "excel";
            insertConfig: {
              sourceWorkSheetKey: string;
              excludeFirstRow: boolean;
              sourceColumnMap: {
                [key: string]: number | null;
              };
            };
            notification?: boolean;
          };
        };
      };
      responses: {
        /** @description Successfully import table inplace */
        200: {
          content: never;
        };
      };
    };
  };
  "/export/{tableId}": {
    /** @description export csv from table */
    get: {
      parameters: {
        query?: {
          viewId?: string;
        };
        path: {
          tableId: string;
        };
      };
      responses: {
        /** @description Download successful */
        200: {
          content: never;
        };
      };
    };
  };
  "/pin": {
    /** @description Delete pin */
    delete: {
      parameters: {
        query: {
          type: "space" | "base" | "table" | "view";
          id: string;
        };
      };
      responses: {
        /** @description Delete pin successfully */
        200: {
          content: never;
        };
      };
    };
  };
  "/pin/": {
    /** @description Add pin */
    post: {
      requestBody?: {
        content: {
          "application/json": {
            /** @enum {string} */
            type: "space" | "base" | "table" | "view";
            id: string;
          };
        };
      };
      responses: {
        /** @description Add pin successfully */
        201: {
          content: never;
        };
      };
    };
  };
  "/pin/list": {
    /** @description Get  pin list */
    get: {
      responses: {
        /** @description Get  pin list, include base pin */
        200: {
          content: {
            "application/json": ({
                id: string;
                /** @enum {string} */
                type: "space" | "base" | "table" | "view";
                order: number;
                name: string;
                icon?: string;
                parentBaseId?: string;
                viewMeta?: {
                  tableId: string;
                  /** @enum {string} */
                  type: "grid" | "calendar" | "kanban" | "form" | "gallery" | "plugin";
                  pluginLogo?: string;
                };
              })[];
          };
        };
      };
    };
  };
  "/pin/order": {
    /** @description Update  pin order */
    put: {
      requestBody?: {
        content: {
          "application/json": {
            id: string;
            /** @enum {string} */
            type: "space" | "base" | "table" | "view";
            anchorId: string;
            /** @enum {string} */
            anchorType: "space" | "base" | "table" | "view";
            /** @enum {string} */
            position: "before" | "after";
          };
        };
      };
      responses: {
        /** @description Update  pin order successfully */
        200: {
          content: never;
        };
      };
    };
  };
  "/space/{spaceId}/billing/subscription/summary": {
    /** @description Retrieves a summary of subscription information for a space */
    get: {
      parameters: {
        path: {
          spaceId: string;
        };
      };
      responses: {
        /** @description Returns a summary of subscription information about a space. */
        200: {
          content: {
            "application/json": {
              spaceId: string;
              /** @enum {string} */
              status: "active" | "canceled" | "incomplete" | "incomplete_expired" | "trialing" | "past_due" | "unpaid" | "paused" | "seat_limit_exceeded";
              /** @enum {string} */
              level: "free" | "plus" | "pro" | "enterprise";
            };
          };
        };
      };
    };
  };
  "/billing/subscription/summary": {
    /** @description Retrieves a summary of subscription information across all spaces */
    get: {
      responses: {
        /** @description Returns a summary of subscription information for each space. */
        200: {
          content: {
            "application/json": ({
                spaceId: string;
                /** @enum {string} */
                status: "active" | "canceled" | "incomplete" | "incomplete_expired" | "trialing" | "past_due" | "unpaid" | "paused" | "seat_limit_exceeded";
                /** @enum {string} */
                level: "free" | "plus" | "pro" | "enterprise";
              })[];
          };
        };
      };
    };
  };
  "/space/{spaceId}/usage": {
    /** @description Get usage information for the space */
    get: {
      parameters: {
        path: {
          spaceId: string;
        };
      };
      responses: {
        /** @description Returns usage information for the space. */
        200: {
          content: {
            "application/json": {
              /** @enum {string} */
              level: "free" | "plus" | "pro" | "enterprise";
              limit: {
                maxRows: number;
                maxSizeAttachments: number;
                maxNumDatabaseConnections: number;
                maxRevisionHistoryDays: number;
                maxAutomationHistoryDays: number;
                automationEnable: boolean;
                auditLogEnable: boolean;
                adminPanelEnable: boolean;
                rowColoringEnable: boolean;
                buttonFieldEnable: boolean;
                fieldAIEnable: boolean;
                userGroupEnable: boolean;
                advancedExtensionsEnable: boolean;
                advancedPermissionsEnable: boolean;
                passwordRestrictedSharesEnable: boolean;
                authenticationEnable: boolean;
                domainVerificationEnable: boolean;
                organizationEnable: boolean;
                apiRateLimit: number;
                chatAIEnable: boolean;
                appEnable: boolean;
                customDomainEnable: boolean;
              };
            };
          };
        };
      };
    };
  };
  "/instance/usage": {
    /** @description Get usage information for the instance */
    get: {
      responses: {
        /** @description Returns usage information for the instance. */
        200: {
          content: {
            "application/json": {
              /** @enum {string} */
              level: "free" | "plus" | "pro" | "enterprise";
              limit: {
                maxRows: number;
                maxSizeAttachments: number;
                maxNumDatabaseConnections: number;
                maxRevisionHistoryDays: number;
                maxAutomationHistoryDays: number;
                automationEnable: boolean;
                auditLogEnable: boolean;
                adminPanelEnable: boolean;
                rowColoringEnable: boolean;
                buttonFieldEnable: boolean;
                fieldAIEnable: boolean;
                userGroupEnable: boolean;
                advancedExtensionsEnable: boolean;
                advancedPermissionsEnable: boolean;
                passwordRestrictedSharesEnable: boolean;
                authenticationEnable: boolean;
                domainVerificationEnable: boolean;
                organizationEnable: boolean;
                apiRateLimit: number;
                chatAIEnable: boolean;
                appEnable: boolean;
                customDomainEnable: boolean;
              };
            };
          };
        };
      };
    };
  };
  "/base/{baseId}/usage": {
    /** @description Get usage information for the base */
    get: {
      parameters: {
        path: {
          baseId: string;
        };
      };
      responses: {
        /** @description Returns usage information for the base. */
        200: {
          content: {
            "application/json": {
              /** @enum {string} */
              level: "free" | "plus" | "pro" | "enterprise";
              limit: {
                maxRows: number;
                maxSizeAttachments: number;
                maxNumDatabaseConnections: number;
                maxRevisionHistoryDays: number;
                maxAutomationHistoryDays: number;
                automationEnable: boolean;
                auditLogEnable: boolean;
                adminPanelEnable: boolean;
                rowColoringEnable: boolean;
                buttonFieldEnable: boolean;
                fieldAIEnable: boolean;
                userGroupEnable: boolean;
                advancedExtensionsEnable: boolean;
                advancedPermissionsEnable: boolean;
                passwordRestrictedSharesEnable: boolean;
                authenticationEnable: boolean;
                domainVerificationEnable: boolean;
                organizationEnable: boolean;
                apiRateLimit: number;
                chatAIEnable: boolean;
                appEnable: boolean;
                customDomainEnable: boolean;
              };
            };
          };
        };
      };
    };
  };
  "/oauth/client/{clientId}": {
    /** @description Get the OAuth application */
    get: {
      parameters: {
        path: {
          clientId: string;
        };
      };
      responses: {
        /** @description Returns the OAuth application */
        200: {
          content: {
            "application/json": {
              clientId: string;
              name: string;
              secrets?: {
                  id: string;
                  secret: string;
                  lastUsedTime?: string;
                }[];
              scopes?: string[];
              /** Format: uri */
              logo?: string;
              /** Format: uri */
              homepage: string;
              redirectUris: string[];
            };
          };
        };
      };
    };
    /** @description Update an OAuth application */
    put: {
      parameters: {
        path: {
          clientId: string;
        };
      };
      requestBody?: {
        content: {
          "application/json": {
            clientId: string;
            name: string;
            secrets?: {
                id: string;
                secret: string;
                lastUsedTime?: string;
              }[];
            scopes?: string[];
            /** Format: uri */
            logo?: string;
            /** Format: uri */
            homepage: string;
            redirectUris: string[];
          };
        };
      };
      responses: {
        /** @description Returns the updated OAuth application */
        200: {
          content: {
            "application/json": {
              clientId: string;
              name: string;
              secrets?: {
                  id: string;
                  secret: string;
                  lastUsedTime?: string;
                }[];
              scopes?: string[];
              /** Format: uri */
              logo?: string;
              /** Format: uri */
              homepage: string;
              redirectUris: string[];
            };
          };
        };
      };
    };
    /** @description Delete an OAuth application */
    delete: {
      parameters: {
        path: {
          clientId: string;
        };
      };
      responses: {
        /** @description OAuth application deleted */
        200: {
          content: never;
        };
      };
    };
  };
  "/oauth/client": {
    /** @description Get the list of OAuth applications */
    get: {
      responses: {
        /** @description Returns the list of OAuth applications */
        200: {
          content: {
            "application/json": {
                clientId: string;
                name: string;
                description?: string;
                /** Format: uri */
                logo?: string;
                /** Format: uri */
                homepage: string;
              }[];
          };
        };
      };
    };
    /** @description Create a new OAuth application */
    post: {
      requestBody?: {
        content: {
          "application/json": {
            name: string;
            description?: string;
            /** Format: uri */
            homepage: string;
            logo?: string;
            scopes?: (("table|create") | ("table|delete") | ("table|export") | ("table|import") | ("table|read") | ("table|update") | ("view|create") | ("view|delete") | ("view|read") | ("view|update") | ("field|create") | ("field|delete") | ("field|read") | ("field|update") | ("record|comment") | ("record|create") | ("record|delete") | ("record|read") | ("record|update") | ("automation|create") | ("automation|delete") | ("automation|read") | ("automation|update") | ("user|email_read"))[];
            redirectUris: string[];
          };
        };
      };
      responses: {
        /** @description Returns the created OAuth application */
        201: {
          content: {
            "application/json": {
              clientId: string;
              name: string;
              secrets?: {
                  id: string;
                  secret: string;
                  lastUsedTime?: string;
                }[];
              scopes?: string[];
              /** Format: uri */
              logo?: string;
              /** Format: uri */
              homepage: string;
              redirectUris: string[];
            };
          };
        };
      };
    };
  };
  "/oauth/client/{clientId}/secret/{secretId}": {
    /** @description Delete the OAuth secret */
    delete: {
      parameters: {
        path: {
          secretId: string;
        };
      };
      responses: {
        /** @description OAuth secret deleted */
        200: {
          content: never;
        };
      };
    };
  };
  "/oauth/client/{clientId}/secret": {
    /** @description Generate a new OAuth secret */
    post: {
      parameters: {
        path: {
          clientId: string;
        };
      };
      responses: {
        /** @description Returns the generated OAuth secret */
        201: {
          content: {
            "application/json": {
              id: string;
              secret: string;
              maskedSecret: string;
              lastUsedTime?: string;
            };
          };
        };
      };
    };
  };
  "/oauth/decision/{transactionId}": {
    /** @description Get the OAuth application */
    get: {
      parameters: {
        path: {
          transactionId: string;
        };
      };
      responses: {
        /** @description Returns the OAuth application */
        200: {
          content: {
            "application/json": {
              name: string;
              description?: string;
              /** Format: uri */
              homepage: string;
              /** Format: uri */
              logo?: string;
              scopes?: string[];
            };
          };
        };
      };
    };
  };
  "/oauth/client/{clientId}/revoke-access": {
    post: {
      parameters: {
        path: {
          clientId: string;
        };
      };
      responses: {
        /** @description Revoke access permission successfully */
        201: {
          content: never;
        };
      };
    };
  };
  "/oauth/client/authorized/list": {
    /** @description Get the list of authorized applications */
    get: {
      responses: {
        /** @description Returns the list of authorized applications */
        200: {
          content: {
            "application/json": {
                clientId: string;
                name: string;
                /** Format: uri */
                homepage: string;
                /** Format: uri */
                logo?: string;
                description?: string;
                scopes?: string[];
                lastUsedTime?: string;
                createdUser: {
                  name: string;
                  /** Format: email */
                  email: string;
                };
              }[];
          };
        };
      };
    };
  };
  "/table/{tableId}/undo-redo/undo": {
    /** @description Undo the last operation */
    post: {
      parameters: {
        path: {
          tableId: string;
        };
      };
      responses: {
        /** @description Returns data about the undo operation. */
        201: {
          content: {
            "application/json": {
              /** @enum {string} */
              status: "fulfilled" | "failed" | "empty";
              errorMessage?: string;
            };
          };
        };
      };
    };
  };
  "/table/{tableId}/undo-redo/redo": {
    /** @description Redo the last operation */
    post: {
      parameters: {
        path: {
          tableId: string;
        };
      };
      responses: {
        /** @description Returns data about the redo operation. */
        201: {
          content: {
            "application/json": {
              /** @enum {string} */
              status: "fulfilled" | "failed" | "empty";
              errorMessage?: string;
            };
          };
        };
      };
    };
  };
  "/comment/{tableId}/{recordId}/{commentId}/reaction": {
    /** @description create record comment reaction */
    post: {
      parameters: {
        path: {
          tableId: string;
          recordId: string;
          commentId: string;
        };
      };
      requestBody?: {
        content: {
          "application/json": {
            reaction: string;
          };
        };
      };
      responses: {
        /** @description Successfully create comment reaction. */
        201: {
          content: never;
        };
      };
    };
    /** @description delete record comment reaction */
    delete: {
      parameters: {
        path: {
          tableId: string;
          recordId: string;
          commentId: string;
        };
      };
      requestBody?: {
        content: {
          "application/json": {
            reaction: string;
          };
        };
      };
      responses: {
        /** @description Successfully delete comment reaction. */
        200: {
          content: never;
        };
      };
    };
  };
  "/comment/{tableId}/{recordId}/{commentId}": {
    /** @description Get record comment detail */
    get: {
      parameters: {
        path: {
          tableId: string;
          recordId: string;
        };
      };
      responses: {
        /** @description Returns the record's comment detail */
        200: {
          content: {
            "application/json": ({
                id: string;
                content: (({
                    /** @enum {string} */
                    type: "p";
                    value?: unknown;
                    children: ({
                        /** @enum {string} */
                        type: "span";
                        value: string;
                      } | {
                        /** @enum {string} */
                        type: "mention";
                        value: string;
                        name?: string;
                        avatar?: string;
                      } | {
                        /** @enum {string} */
                        type: "a";
                        value?: unknown;
                        url: string;
                        title: string;
                      })[];
                  }) | {
                    /** @enum {string} */
                    type: "img";
                    value?: unknown;
                    path: string;
                    width?: number;
                    url?: string;
                  })[];
                createdBy: {
                  id: string;
                  name: string;
                  avatar?: string;
                };
                reaction?: {
                    reaction: string;
                    user: {
                        id: string;
                        name: string;
                        avatar?: string;
                      }[];
                  }[] | null;
                createdTime: string;
                lastModifiedTime?: string;
                quoteId?: string;
                deletedTime?: string;
              })[];
          };
        };
      };
    };
    /** @description delete record comment */
    delete: {
      parameters: {
        path: {
          tableId: string;
          recordId: string;
          commentId: string;
        };
      };
      responses: {
        /** @description Successfully delete comment. */
        200: {
          content: never;
        };
      };
    };
    /** @description update record comment */
    patch: {
      parameters: {
        path: {
          tableId: string;
          recordId: string;
          commentId: string;
        };
      };
      requestBody?: {
        content: {
          "application/json": {
            content: (({
                /** @enum {string} */
                type: "p";
                value?: unknown;
                children: ({
                    /** @enum {string} */
                    type: "span";
                    value: string;
                  } | {
                    /** @enum {string} */
                    type: "mention";
                    value: string;
                    name?: string;
                    avatar?: string;
                  } | {
                    /** @enum {string} */
                    type: "a";
                    value?: unknown;
                    url: string;
                    title: string;
                  })[];
              }) | {
                /** @enum {string} */
                type: "img";
                value?: unknown;
                path: string;
                width?: number;
                url?: string;
              })[];
          };
        };
      };
      responses: {
        /** @description Successfully update comment. */
        200: {
          content: never;
        };
      };
    };
  };
  "/comment/{tableId}/{recordId}/list": {
    /** @description Get record comment list */
    get: {
      parameters: {
        query?: {
          take?: string | number;
          cursor?: string | null;
          includeCursor?: boolean | ("true" | "false");
          direction?: "forward" | "backward";
        };
        path: {
          tableId: string;
          recordId: string;
        };
      };
      responses: {
        /** @description Returns the list of record's comment */
        200: {
          content: {
            "application/json": {
              comments: ({
                  id: string;
                  content: (({
                      /** @enum {string} */
                      type: "p";
                      value?: unknown;
                      children: ({
                          /** @enum {string} */
                          type: "span";
                          value: string;
                        } | {
                          /** @enum {string} */
                          type: "mention";
                          value: string;
                          name?: string;
                          avatar?: string;
                        } | {
                          /** @enum {string} */
                          type: "a";
                          value?: unknown;
                          url: string;
                          title: string;
                        })[];
                    }) | {
                      /** @enum {string} */
                      type: "img";
                      value?: unknown;
                      path: string;
                      width?: number;
                      url?: string;
                    })[];
                  createdBy: {
                    id: string;
                    name: string;
                    avatar?: string;
                  };
                  reaction?: {
                      reaction: string;
                      user: {
                          id: string;
                          name: string;
                          avatar?: string;
                        }[];
                    }[] | null;
                  createdTime: string;
                  lastModifiedTime?: string;
                  quoteId?: string;
                  deletedTime?: string;
                })[];
              nextCursor?: string | null;
            };
          };
        };
      };
    };
  };
  "/comment/{tableId}/{recordId}/create": {
    /** @description create record comment */
    post: {
      parameters: {
        path: {
          tableId: string;
          recordId: string;
        };
      };
      requestBody?: {
        content: {
          "application/json": {
            quoteId?: string | null;
            content: (({
                /** @enum {string} */
                type: "p";
                value?: unknown;
                children: ({
                    /** @enum {string} */
                    type: "span";
                    value: string;
                  } | {
                    /** @enum {string} */
                    type: "mention";
                    value: string;
                    name?: string;
                    avatar?: string;
                  } | {
                    /** @enum {string} */
                    type: "a";
                    value?: unknown;
                    url: string;
                    title: string;
                  })[];
              }) | {
                /** @enum {string} */
                type: "img";
                value?: unknown;
                path: string;
                width?: number;
                url?: string;
              })[];
          };
        };
      };
      responses: {
        /** @description Successfully create comment. */
        201: {
          content: never;
        };
      };
    };
  };
  "/comment/{tableId}/{recordId}/subscribe": {
    /** @description get record comment subscribe detail */
    get: {
      parameters: {
        path: {
          tableId: string;
          recordId: string;
        };
      };
      responses: {
        /** @description Successfully get record comment subscribe detail. */
        200: {
          content: {
            "application/json": {
              tableId: string;
              recordId: string;
              createdBy: string;
            } | null;
          };
        };
      };
    };
    /** @description subscribe record comment's active */
    post: {
      parameters: {
        path: {
          tableId: string;
          recordId: string;
        };
      };
      responses: {
        /** @description Successfully subscribe record comment. */
        201: {
          content: never;
        };
      };
    };
    /** @description unsubscribe record comment */
    delete: {
      parameters: {
        path: {
          tableId: string;
          recordId: string;
        };
      };
      responses: {
        /** @description Successfully subscribe record comment. */
        200: {
          content: never;
        };
      };
    };
  };
  "/comment/{tableId}/{recordId}/attachment/{path}": {
    /** @description Get record comment attachment url */
    get: {
      parameters: {
        path: {
          tableId: string;
          recordId: string;
        };
      };
      responses: {
        /** @description Returns the record's comment attachment url */
        200: {
          content: {
            "application/json": string;
          };
        };
      };
    };
  };
  "/comment/{tableId}/count": {
    /** @description Get record comment counts by query */
    get: {
      parameters: {
        query?: {
          projection?: string[];
          cellFormat?: "json" | "text";
          /** @description Define the key type of record.fields[key], You can click "systemInfo" in the field edit box to get fieldId or enter the table design screen with all the field details */
          fieldKeyType?: "id" | "name" | "dbFieldName";
          viewId?: string;
          ignoreViewQuery?: string | boolean;
          filterByTql?: string;
          filter?: string;
          search?: string[] | ((string | (string | boolean))[]);
          filterLinkCellCandidate?: string[] | string;
          filterLinkCellSelected?: string[] | string;
          selectedRecordIds?: string[];
          orderBy?: string;
          groupBy?: string;
          collapsedGroupIds?: string;
          queryId?: string;
          take?: string | number;
          skip?: string | number;
        };
        path: {
          tableId: string;
        };
      };
      responses: {
        /** @description Returns the comment counts by query */
        200: {
          content: {
            "application/json": {
                recordId: string;
                count: number;
              }[];
          };
        };
      };
    };
  };
  "/comment/{tableId}/{recordId}/count": {
    /** @description Get record comment count */
    get: {
      parameters: {
        path: {
          tableId: string;
        };
      };
      responses: {
        /** @description Returns the comment count by query */
        200: {
          content: {
            "application/json": {
              count: number;
            };
          };
        };
      };
    };
  };
  "/organization/me": {
    /** @description Get my organization */
    get: {
      responses: {
        /** @description Get my organization successfully */
        200: {
          content: {
            "application/json": {
              id: string;
              name: string;
              isAdmin: boolean;
            } | null;
          };
        };
      };
    };
  };
  "/organization/department": {
    get: {
      parameters: {
        query?: {
          parentId?: string;
          search?: string;
          includeChildrenDepartment?: string;
        };
        path: {
          organizationId: string;
        };
      };
      responses: {
        /** @description Get department list successfully */
        200: {
          content: {
            "application/json": {
                id: string;
                name: string;
                parentId?: string;
                path?: string[];
                pathName?: string[];
                hasChildren: boolean;
              }[];
          };
        };
      };
    };
  };
  "/organization/department-user": {
    get: {
      parameters: {
        query?: {
          departmentId?: string;
          includeChildrenDepartment?: string;
          skip?: string | number;
          take?: string | number;
          search?: string;
        };
        path: {
          organizationId: string;
        };
      };
      responses: {
        /** @description Get department users successfully */
        200: {
          content: {
            "application/json": {
              users: {
                  id: string;
                  name: string;
                  email: string;
                  avatar?: string;
                  departments?: {
                      id: string;
                      name: string;
                      path?: string[];
                      pathName?: string[];
                    }[];
                }[];
              total: number;
            };
          };
        };
      };
    };
  };
  "/api/{baseId}/ai/generate-stream": {
    /** @description Generate ai stream */
    post: {
      parameters: {
        path: {
          baseId: string;
        };
      };
      requestBody?: {
        content: {
          "application/json": {
            prompt: string;
            /**
             * @description Quick model selection via predefined task type
             * @example coding
             * @enum {string}
             */
            task?: "coding" | "embedding" | "translation";
            /**
             * @description Specify an exact model configuration to use
             * @example openai@gpt-4o@custom-name
             */
            modelKey?: string;
          };
        };
      };
      responses: {
        /** @description Returns ai generate stream. */
        201: {
          content: {
            "application/json": {
              result: string;
            };
          };
        };
      };
    };
  };
  "/{baseId}/ai/config": {
    /** @description Get the configuration of ai, including instance and space configuration */
    get: {
      parameters: {
        path: {
          baseId: string;
        };
      };
      responses: {
        /** @description Returns the configuration of ai. */
        200: {
          content: {
            "application/json": {
              /** @default [] */
              llmProviders?: ({
                  /** @enum {string} */
                  type: "openai" | "anthropic" | "google" | "azure" | "cohere" | "mistral" | "deepseek" | "qwen" | "zhipu" | "lingyiwanwu" | "xai" | "togetherai" | "ollama" | "amazonBedrock" | "openRouter";
                  name: string;
                  apiKey?: string;
                  /** Format: uri */
                  baseUrl?: string;
                  /** @default */
                  models?: string;
                  isInstance?: boolean;
                })[];
              embeddingModel?: string;
              translationModel?: string;
              chatModel?: {
                lg?: string;
                md?: string;
                sm?: string;
                ability?: {
                  image?: boolean;
                  pdf?: boolean;
                  webSearch?: boolean;
                };
              };
              capabilities?: {
                disableActions?: string[];
              };
              modelDefinationMap?: {
                [key: string]: {
                  /**
                   * @description The number of credits spent using a prompt token
                   * @example 0.001
                   */
                  inputRate: number;
                  /**
                   * @description The number of credits spent using a completion token
                   * @example 0.0025
                   */
                  outputRate: number;
                  /** @description Whether to enable vision */
                  visionEnable?: boolean;
                  /** @description Whether to enable audio */
                  audioEnable?: boolean;
                  /** @description Whether to enable video */
                  videoEnable?: boolean;
                  /** @description Whether to enable deep think */
                  deepThinkEnable?: boolean;
                } | ({
                  /**
                   * @description The number of credits spent for generating one image
                   * @example 100
                   */
                  usagePerUnit: number;
                  /** @enum {string} */
                  outputType: "image" | "audio" | "video";
                });
              };
            };
          };
        };
      };
    };
  };
  "/{baseId}/ai/disable-ai-actions": {
    /** @description Get the disable ai actions */
    get: {
      parameters: {
        path: {
          baseId: string;
        };
      };
      responses: {
        /** @description Returns the configuration of ai. */
        200: {
          content: {
            "application/json": {
              disableActions: string[];
            };
          };
        };
      };
    };
  };
  "/integrity/base/{baseId}/link-check": {
    /** @description Check integrity of link fields in a base */
    get: {
      parameters: {
        query: {
          tableId: string;
        };
        path: {
          baseId: string;
        };
      };
      responses: {
        /** @description Returns integrity check results for the base */
        200: {
          content: {
            "application/json": {
              hasIssues: boolean;
              linkFieldIssues: ({
                  /** @description The base id of the link field with is cross-base */
                  baseId?: string;
                  baseName?: string;
                  tableId?: string;
                  tableName?: string;
                  issues: ({
                      /** @enum {string} */
                      type: "ForeignTableNotFound" | "ForeignKeyNotFound" | "SelfKeyNotFound" | "SymmetricFieldNotFound" | "MissingRecordReference" | "InvalidLinkReference" | "ForeignKeyHostTableNotFound" | "ReferenceFieldNotFound" | "UniqueIndexNotFound" | "EmptyString";
                      message: string;
                      fieldId: string;
                      tableId?: string;
                    })[];
                })[];
            };
          };
        };
      };
    };
  };
  "/integrity/base/{baseId}/link-fix?tableId={tableId}": {
    /** @description Fix integrity of link fields in a base */
    post: {
      parameters: {
        query: {
          tableId: string;
        };
        path: {
          baseId: string;
        };
      };
      responses: {
        /** @description Success */
        201: {
          content: {
            "application/json": ({
                /** @enum {string} */
                type: "ForeignTableNotFound" | "ForeignKeyNotFound" | "SelfKeyNotFound" | "SymmetricFieldNotFound" | "MissingRecordReference" | "InvalidLinkReference" | "ForeignKeyHostTableNotFound" | "ReferenceFieldNotFound" | "UniqueIndexNotFound" | "EmptyString";
                message: string;
                fieldId: string;
                tableId?: string;
              })[];
          };
        };
      };
    };
  };
  "/table/{tableId}/plugin-panel/{pluginPanelId}": {
    /** @description Get a plugin panel */
    get: {
      parameters: {
        path: {
          tableId: string;
          pluginPanelId: string;
        };
      };
      responses: {
        /** @description Plugin panel retrieved successfully. */
        200: {
          content: never;
        };
      };
    };
    /** @description Delete a plugin panel */
    delete: {
      parameters: {
        path: {
          tableId: string;
          pluginPanelId: string;
        };
      };
      responses: {
        /** @description Plugin panel deleted successfully. */
        200: {
          content: never;
        };
      };
    };
  };
  "/table/{tableId}/plugin-panel": {
    /** @description Get all plugin panels */
    get: {
      parameters: {
        path: {
          tableId: string;
        };
      };
      responses: {
        /** @description Plugin panels retrieved successfully. */
        200: {
          content: {
            "application/json": {
                id: string;
                name: string;
              }[];
          };
        };
      };
    };
    /** @description Create a plugin panel */
    post: {
      parameters: {
        path: {
          tableId: string;
        };
      };
      requestBody?: {
        content: {
          "application/json": {
            name: string;
          };
        };
      };
      responses: {
        /** @description Plugin panel created successfully. */
        201: {
          content: {
            "application/json": {
              id: string;
              name: string;
            };
          };
        };
      };
    };
  };
  "/table/{tableId}/plugin-panel/{pluginPanelId}/rename": {
    /** @description Rename a plugin panel */
    patch: {
      parameters: {
        path: {
          tableId: string;
          pluginPanelId: string;
        };
      };
      requestBody?: {
        content: {
          "application/json": {
            name: string;
          };
        };
      };
      responses: {
        /** @description Plugin panel updated successfully. */
        200: {
          content: {
            "application/json": {
              name: string;
            };
          };
        };
      };
    };
  };
  "/table/{tableId}/plugin-panel/{pluginPanelId}/layout": {
    /** @description Update the layout of a plugin panel */
    patch: {
      parameters: {
        path: {
          tableId: string;
          pluginPanelId: string;
        };
      };
      requestBody?: {
        content: {
          "application/json": {
            layout: {
                pluginInstallId: string;
                x: number;
                y: number;
                w: number;
                h: number;
              }[];
          };
        };
      };
      responses: {
        /** @description The layout of the plugin panel was updated successfully. */
        200: {
          content: {
            "application/json": {
              id: string;
              layout: {
                  pluginInstallId: string;
                  x: number;
                  y: number;
                  w: number;
                  h: number;
                }[];
            };
          };
        };
      };
    };
  };
  "/table/{tableId}/plugin-panel/{pluginPanelId}/install": {
    /** @description Install a plugin to a table plugin panel */
    post: {
      parameters: {
        path: {
          tableId: string;
          pluginPanelId: string;
        };
      };
      requestBody?: {
        content: {
          "application/json": {
            name?: string;
            pluginId: string;
          };
        };
      };
      responses: {
        /** @description Plugin installed successfully. */
        201: {
          content: {
            "application/json": {
              name: string;
              pluginId: string;
              pluginInstallId: string;
            };
          };
        };
      };
    };
  };
  "/table/{tableId}/plugin-panel/{pluginPanelId}/plugin/{pluginInstallId}": {
    /** @description Get a plugin in plugin panel */
    get: {
      parameters: {
        path: {
          tableId: string;
          pluginPanelId: string;
          pluginId: string;
        };
      };
      responses: {
        /** @description Returns data about the plugin. */
        200: {
          content: {
            "application/json": {
              baseId: string;
              name: string;
              tableId: string;
              pluginId: string;
              pluginInstallId: string;
              storage?: {
                [key: string]: unknown;
              };
            };
          };
        };
      };
    };
    /** @description Remove a plugin from a plugin panel */
    delete: {
      parameters: {
        path: {
          tableId: string;
          pluginPanelId: string;
          pluginInstallId: string;
        };
      };
      responses: {
        /** @description Plugin removed from plugin panel successfully. */
        200: {
          content: never;
        };
      };
    };
  };
  "/table/{tableId}/plugin-panel/{pluginPanelId}/plugin/{pluginInstallId}/rename": {
    /** @description Rename a plugin in a plugin panel */
    patch: {
      parameters: {
        path: {
          tableId: string;
          pluginPanelId: string;
          pluginInstallId: string;
        };
      };
      requestBody?: {
        content: {
          "application/json": {
            name: string;
          };
        };
      };
      responses: {
        /** @description Plugin renamed successfully. */
        200: {
          content: {
            "application/json": {
              id: string;
              name: string;
            };
          };
        };
      };
    };
  };
  "/table/{tableId}/plugin-panel/{pluginPanelId}/plugin/{pluginInstallId}/update-storage": {
    /** @description Update storage of a plugin in a plugin panel */
    patch: {
      parameters: {
        path: {
          tableId: string;
          pluginPanelId: string;
          pluginInstallId: string;
        };
      };
      requestBody?: {
        content: {
          "application/json": {
            storage?: {
              [key: string]: unknown;
            };
          };
        };
      };
      responses: {
        /** @description Storage updated successfully. */
        200: {
          content: {
            "application/json": {
              [key: string]: unknown;
            };
          };
        };
      };
    };
  };
  "/table/{tableId}/plugin-panel/{pluginPanelId}/duplicate": {
    /**
     * Duplicate a plugin panel
     * @description Duplicate a plugin panel
     */
    post: {
      parameters: {
        path: {
          baseId: string;
          id: string;
        };
      };
      responses: {
        /** @description Returns the duplicated plugin panel info. */
        200: {
          content: {
            "application/json": {
              id: string;
              name: string;
            };
          };
        };
      };
    };
  };
  "/table/{tableId}/plugin-panel/{pluginPanelId}/plugin/{installedId}/duplicate": {
    /**
     * Duplicate a dashboard installed plugin
     * @description Duplicate a dashboard installed plugin
     */
    post: {
      parameters: {
        path: {
          baseId: string;
          id: string;
        };
      };
      responses: {
        /** @description Returns the duplicated dashboard info. */
        200: {
          content: {
            "application/json": {
              id: string;
              name: string;
            };
          };
        };
      };
    };
  };
  "/table/{tableId}/plugin-context-menu/{pluginInstallId}": {
    get: {
      parameters: {
        path: {
          tableId: string;
          pluginInstallId: string;
        };
      };
      responses: {
        /** @description Returns data about the plugin context menu. */
        200: {
          content: {
            "application/json": {
              name: string;
              tableId: string;
              pluginId: string;
              pluginInstallId: string;
              positionId: string;
              url?: string;
              config?: {
                contextMenu?: {
                  width?: number | string;
                  height?: number | string;
                  x?: number | string;
                  y?: number | string;
                  frozenResize?: boolean;
                  frozenDrag?: boolean;
                };
                view?: unknown;
                dashboard?: unknown;
                panel?: unknown;
              };
            };
          };
        };
      };
    };
    /** @description Remove a plugin context menu */
    delete: {
      parameters: {
        path: {
          tableId: string;
          pluginInstallId: string;
        };
      };
      responses: {
        /** @description Plugin context menu removed successfully. */
        200: {
          content: never;
        };
      };
    };
  };
  "/table/{tableId}/plugin-context-menu/install": {
    /** @description Install a plugin context menu */
    post: {
      parameters: {
        path: {
          tableId: string;
        };
      };
      requestBody?: {
        content: {
          "application/json": {
            name?: string;
            pluginId: string;
          };
        };
      };
      responses: {
        /** @description Plugin context menu installed successfully. */
        201: {
          content: {
            "application/json": {
              pluginInstallId: string;
              name: string;
              order: number;
            };
          };
        };
      };
    };
  };
  "/table/{tableId}/plugin-context-menu/{pluginInstallId}/move": {
    put: {
      parameters: {
        path: {
          tableId: string;
          pluginInstallId: string;
        };
      };
      requestBody?: {
        content: {
          "application/json": {
            anchorId: string;
            /** @enum {string} */
            position: "before" | "after";
          };
        };
      };
      responses: {
        /** @description Plugin context menu moved successfully. */
        200: {
          content: never;
        };
      };
    };
  };
  "/table/{tableId}/plugin-context-menu/{pluginInstallId}/rename": {
    /** @description Rename a plugin context menu */
    patch: {
      parameters: {
        path: {
          tableId: string;
          pluginInstallId: string;
        };
      };
      requestBody?: {
        content: {
          "application/json": {
            name: string;
          };
        };
      };
      responses: {
        /** @description Plugin context menu renamed successfully. */
        200: {
          content: never;
        };
      };
    };
  };
  "/table/{tableId}/plugin-context-menu/{pluginInstallId}/update-storage": {
    put: {
      parameters: {
        path: {
          tableId: string;
          pluginInstallId: string;
        };
      };
      requestBody?: {
        content: {
          "application/json": {
            storage?: {
              [key: string]: unknown;
            };
          };
        };
      };
      responses: {
        /** @description Plugin context menu updated successfully. */
        200: {
          content: {
            "application/json": {
              tableId: string;
              pluginInstallId: string;
              storage?: {
                [key: string]: unknown;
              };
            };
          };
        };
      };
    };
  };
  "/table/{tableId}/plugin-context-menu": {
    get: {
      parameters: {
        path: {
          tableId: string;
        };
      };
      responses: {
        /** @description Returns a list of plugins */
        200: {
          content: {
            "application/json": {
                pluginInstallId: string;
                name: string;
                pluginId: string;
                logo: string;
                order: number;
              }[];
          };
        };
      };
    };
  };
  "/table/{tableId}/plugin-context-menu/{pluginInstallId}/storage": {
    get: {
      parameters: {
        path: {
          tableId: string;
          pluginInstallId: string;
        };
      };
      responses: {
        /** @description Plugin context menu storage retrieved successfully. */
        200: {
          content: {
            "application/json": {
              name: string;
              tableId: string;
              pluginId: string;
              pluginInstallId: string;
              storage: {
                [key: string]: unknown;
              };
            };
          };
        };
      };
    };
  };
  "/template/create": {
    /** @description create a template */
    post: {
      requestBody?: {
        content: {
          "application/json": {
            name?: string;
            description?: string;
            category?: string;
          };
        };
      };
      responses: {
        /** @description Successfully create template. */
        201: {
          content: never;
        };
      };
    };
  };
  "/template/{templateId}": {
    /**
     * get template detail by templateId
     * @description get template detail by templateId
     */
    get: {
      responses: {
        /** @description Successfully get template detail. */
        201: {
          content: {
            "application/json": {
              id: string;
              name?: string;
              categoryId?: string;
              isSystem?: boolean;
              isPublished?: boolean;
              snapshot: {
                baseId: string;
                /** Format: date-time */
                snapshotTime: string;
                spaceId: string;
                name: string;
              };
              description?: string;
              baseId?: string;
              cover: {
                /**
                 * @description Token for the uploaded file
                 * @example xxxxxxxxxxx
                 */
                token: string;
                /**
                 * @description File size in bytes
                 * @example 1024
                 */
                size: number;
                /**
                 * @description URL of the uploaded file
                 * @example /bucket/xxxxx
                 */
                url: string;
                /**
                 * @description file path
                 * @example /table/xxxxxx
                 */
                path: string;
                /**
                 * @description MIME type of the uploaded file
                 * @example video/mp4
                 */
                mimetype: string;
                /**
                 * @description Image width of the uploaded file
                 * @example 100
                 */
                width?: number;
                /**
                 * @description Image height of the uploaded file
                 * @example 100
                 */
                height?: number;
                name: string;
                id: string;
                presignedUrl: string;
              };
              usageCount: number;
              markdownDescription?: string;
            };
          };
        };
      };
    };
    /** @description delete a template */
    delete: {
      parameters: {
        path: {
          templateId: string;
        };
      };
      responses: {
        /** @description Successfully delete template. */
        201: {
          content: never;
        };
      };
    };
    /** @description update a template */
    patch: {
      parameters: {
        path: {
          templateId: string;
        };
      };
      requestBody?: {
        content: {
          "application/json": {
            name?: string;
            description?: string;
            categoryId?: string;
            cover?: {
              /**
               * @description Token for the uploaded file
               * @example xxxxxxxxxxx
               */
              token: string;
              /**
               * @description File size in bytes
               * @example 1024
               */
              size: number;
              /**
               * @description URL of the uploaded file
               * @example /bucket/xxxxx
               */
              url: string;
              /**
               * @description file path
               * @example /table/xxxxxx
               */
              path: string;
              /**
               * @description MIME type of the uploaded file
               * @example video/mp4
               */
              mimetype: string;
              /**
               * @description Image width of the uploaded file
               * @example 100
               */
              width?: number;
              /**
               * @description Image height of the uploaded file
               * @example 100
               */
              height?: number;
              name: string;
              id: string;
            } | null;
            isPublished?: boolean;
            isSystem?: boolean;
            baseId?: string;
            markdownDescription?: string;
          };
        };
      };
      responses: {
        /** @description Successfully update template. */
        201: {
          content: never;
        };
      };
    };
  };
  "/template": {
    /** @description get template list */
    get: {
      responses: {
        /** @description Successfully get template list. */
        201: {
          content: {
            "application/json": {
                id: string;
                name?: string;
                categoryId?: string;
                isSystem?: boolean;
                isPublished?: boolean;
                snapshot: {
                  baseId: string;
                  /** Format: date-time */
                  snapshotTime: string;
                  spaceId: string;
                  name: string;
                };
                description?: string;
                baseId?: string;
                cover: {
                  /**
                   * @description Token for the uploaded file
                   * @example xxxxxxxxxxx
                   */
                  token: string;
                  /**
                   * @description File size in bytes
                   * @example 1024
                   */
                  size: number;
                  /**
                   * @description URL of the uploaded file
                   * @example /bucket/xxxxx
                   */
                  url: string;
                  /**
                   * @description file path
                   * @example /table/xxxxxx
                   */
                  path: string;
                  /**
                   * @description MIME type of the uploaded file
                   * @example video/mp4
                   */
                  mimetype: string;
                  /**
                   * @description Image width of the uploaded file
                   * @example 100
                   */
                  width?: number;
                  /**
                   * @description Image height of the uploaded file
                   * @example 100
                   */
                  height?: number;
                  name: string;
                  id: string;
                  presignedUrl: string;
                };
                usageCount: number;
                markdownDescription?: string;
              }[];
          };
        };
      };
    };
  };
  "/template/published": {
    /** @description get published template list */
    get: {
      responses: {
        /** @description Successfully get published template list. */
        201: {
          content: never;
        };
      };
    };
  };
  "/template/{templateId}/snapshot": {
    /** @description create a template snapshot */
    post: {
      parameters: {
        path: {
          templateId: string;
        };
      };
      responses: {
        /** @description Successfully create template snapshot. */
        201: {
          content: never;
        };
      };
    };
  };
  "/template/category/create": {
    /** @description create a template category */
    post: {
      requestBody?: {
        content: {
          "application/json": {
            name: string;
          };
        };
      };
      responses: {
        /** @description Successfully create template category. */
        201: {
          content: never;
        };
      };
    };
  };
  "/template/category/list": {
    /** @description get template category list */
    get: {
      responses: {
        /** @description Successfully get template category list. */
        200: {
          content: never;
        };
      };
    };
  };
  "/template/category/{templateCategoryId}": {
    /** @description delete a template category */
    delete: {
      parameters: {
        path: {
          templateCategoryId: string;
        };
      };
      responses: {
        /** @description Successfully delete template category. */
        201: {
          content: never;
        };
      };
    };
    /** @description update a template category name */
    patch: {
      parameters: {
        path: {
          templateCategoryId: string;
        };
      };
      requestBody?: {
        content: {
          "application/json": {
            name: string;
          };
        };
      };
      responses: {
        /** @description Successfully update template category name. */
        201: {
          content: never;
        };
      };
    };
  };
  "/template/category/list/published": {
    /**
     * get published template category list
     * @description get published template category list
     */
    get: {
      responses: {
        /** @description Successfully get template category list. */
        200: {
          content: never;
        };
      };
    };
  };
  "/template/{templateId}/pin-top": {
    /** @description pin top a template */
    patch: {
      parameters: {
        path: {
          templateId: string;
        };
      };
      responses: {
        /** @description Successfully pin top a template. */
        201: {
          content: never;
        };
      };
    };
  };
}

export type webhooks = Record<string, never>;

export interface components {
  schemas: {
  };
  responses: never;
  parameters: {
  };
  requestBodies: never;
  headers: never;
  pathItems: never;
}

export type $defs = Record<string, never>;

export type external = Record<string, never>;

export type operations = Record<string, never>;
